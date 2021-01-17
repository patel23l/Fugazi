const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const client = require('./db')
const Multer = require('multer')
const { Storage } = require('@google-cloud/storage')
const crypto = require('crypto')
const videoIntelligence = require('@google-cloud/video-intelligence')
// const { machineIdSync } = require('node-machine-id')
// const axios = require('axios')

const router = express.Router()

const storage = new Storage({ keyFilename: process.env.GOOGLE_KEY_PATH })

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 700 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (
      !file.mimetype.includes('mp4')
    ) {
      return cb(null, false, new Error('Only videos are allowed'))
    }
    cb(null, true)
  }
})
const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME)
const videoclient = new videoIntelligence.VideoIntelligenceServiceClient({keyFilename: process.env.GOOGLE_KEY_PATH});

router.post('/upload', multer.single('file'), async (req, res, next) => {
    // req.allowedRoles = ['admin', 'owner', 'manager', 'tenant'];
    passport.authenticate('jwt', { session: false }, async (error, user) => {
      if (error || !user) {
        return !user ? res.status(403).json({ message: 'User does not have enough permissions' }) : error
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' })
      }
  
      try {
        const checksum = crypto.createHash('MD5').update(crypto.randomBytes(32)).digest('hex')
        const blob = bucket.file(`${user.email}/${checksum}.${req.file.mimetype.split('/')[1]}`) // MD5 + random
        const blobStream = blob.createWriteStream()
  
        blobStream.on('error', (err) => {
          next(err)
        })
  
        blobStream.on('finish', async () => {
          // The public URL can be used to directly access the file via HTTP.
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          await client.query('INSERT INTO videos (email, blobname, uploadname, url, analysed) VALUES ($1, $2, $3, $4, $5)', [user.email, blob.name, req.body.name, publicUrl, 0])
          res.json({ blob: blob.name })
        })
        blobStream.end(req.file.buffer)
      } catch (err) {
        next(err)
      }
    })(req, res, next)
})

router.post('/analyse', async (req, res, next) => {
    // req.allowedRoles = ['admin', 'owner', 'manager', 'tenant'];
    passport.authenticate('jwt', { session: false }, async (error, user) => {
        if (error || !user) {
            return !user ? res.status(403).json({ message: 'User does not have enough permissions' }) : error
        }

        const videoRows = await client.query('SELECT * FROM videos WHERE blobname = $1', [req.body.blobname]);
        if(videoRows.rowCount == 0) {
            return res.status(405).json({message: "Video not found"});
        }
        const videoRow = videoRows.rows[0];
        if(videoRow.analysed == 3) {
            return res.json({message: "failed"});
        }
        if(videoRow.analysed == 2) {
            return res.json({message: "still analysing"});
        }
        if(videoRow.analysed == 1) {
            // console.log(videoRow.jsondata);
            return res.json(videoRow.jsondata);
        }
        // const gcsUri = 'gs://cloud-samples-data/video/cat.mp4';
        const request = {
            inputUri: `gs://${bucket.name}/${videoRow.blobname}`,
            features: ['LABEL_DETECTION'],
        };

        // Execute request
        let prevLabels = await client.query('SELECT labeljson FROM labels WHERE email=$1;', [user.email]);
        let labelTo1 = {};
        if(prevLabels.rowCount == 0) {
            await client.query('INSERT INTO labels (email, labeljson) VALUES($1, $2);', [user.email, '{}'])
        } else {
            labelTo1 = prevLabels.rows[0].labeljson;
        }
        
        await client.query('UPDATE videos SET analysed=2 WHERE email=$1;', [user.email]);
        videoclient.annotateVideo(request).then((operation) => {
            return operation[0].promise();
        }).then((operationResult) => {
            const annotations = operationResult[0].annotationResults[0];
            // Gets labels for video from its annotations
            const objects = annotations.objectAnnotations;
            let jsonData = {};
            objects.forEach(obj => {
                // console.log(`Label ${label.entity.description} occurs at:`);
                segment = obj.segment;
                if (segment.startTimeOffset.seconds === undefined) {
                    segment.startTimeOffset.seconds = 0;
                }
                if (segment.startTimeOffset.nanos === undefined) {
                    segment.startTimeOffset.nanos = 0;
                }
                if (segment.endTimeOffset.seconds === undefined) {
                    segment.endTimeOffset.seconds = 0;
                }
                if (segment.endTimeOffset.nanos === undefined) {
                    segment.endTimeOffset.nanos = 0;
                }
                // console.log(
                // `\tStart: ${segment.startTimeOffset.seconds}` +
                //     `.${(segment.startTimeOffset.nanos / 1e6).toFixed(0)}s`
                // );
                // console.log(
                // `\tEnd: ${segment.endTimeOffset.seconds}.` +
                //     `${(segment.endTimeOffset.nanos / 1e6).toFixed(0)}s`
                // );
                // console.log(`Confidence: ${object.confidence}`);
                let arr = [];
                obj.frames.forEach(frame => {
                    const box = frame.normalizedBoundingBox;
                    const timeOffset = frame.timeOffset;
                    // console.log(
                    //     `Time offset for the first frame: ${timeOffset.seconds || 0}` +
                    //     `.${(timeOffset.nanos / 1e6).toFixed(0)}s`
                    // );
                    // console.log('Bounding box position:');
                    // console.log(` left   :${box.left}`);
                    // console.log(` top    :${box.top}`);
                    // console.log(` right  :${box.right}`);
                    // console.log(` bottom :${box.bottom}`);
                    arr.push({
                        offset: segment.startTimeOffset.seconds + (segment.startTimeOffset.nanos / 1e9) + (timeOffset.seconds || 0) + (timeOffset.nanos / 1e9),
                        left: box.left,
                        top: box.top,
                        right: box.right,
                        bottom: box.bottom
                    })
                })

                jsonData[obj.entity.description] = {
                    s: segment.startTimeOffset.seconds + (segment.startTimeOffset.nanos / 1e9),
                    e: segment.endTimeOffset.seconds + (segment.endTimeOffset.nanos / 1e9),
                    frames: arr
                };
                labelTo1[obj.entity.description] = 1;
            });
            
            return client.query('UPDATE videos SET analysed=1, jsondata=$1 WHERE email=$2;', [JSON.stringify(jsonData), user.email]);
        }).then(() => {
            return client.query('UPDATE labels SET labeljson=$2 WHERE email=$1;', [user.email, JSON.stringify(labelTo1)]);
        })
        .catch((e) => {
            console.log(e);
            return client.query('UPDATE videos SET analysed=3 WHERE email=$1;', [user.email]);
        }).then(() => {});
        return res.json({message: "processing"});
    })(req, res, next)
})

router.post('/query', async (req, res, next) => {
    // req.allowedRoles = ['admin', 'owner', 'manager', 'tenant'];
    passport.authenticate('jwt', { session: false }, async (error, user) => {
        if (error || !user) {
            return !user ? res.status(403).json({ message: 'User does not have enough permissions' }) : error
        }

        console.log(user.email);
        // const videoRows = await client.query('SELECT * FROM videos WHERE email = $1 AND analysed=1', [user.email]);
        // if(videoRows.rowCount == 0) {
        //     return res.status(405).json({message: "Videos not found"});
        // }

        // const operator = req.body.operator; // 'and' or 'or'
        const trueLabels = req.body.label; // (1 and/or 2 and/or 3)
        console.log(trueLabels);
        // const notLabels = req.body.no_labels; // (not 1 and/or not 2 and/or not 3)

        const videoResults = await client.query("SELECT blobname, uploadname, url, jsondata->'"+trueLabels+"' as label FROM videos WHERE email=$1 AND analysed=1", [user.email]);
        console.log(videoResults.command);
        return res.json(videoResults.rows);
        // make a generic function to test for the above;
        // retrieve json data and do magic
 
    })(req, res, next)
})

router.get('/blobs', async (req, res, next) => {
    // req.allowedRoles = ['admin', 'owner', 'manager', 'tenant'];
    passport.authenticate('jwt', { session: false }, async (error, user) => {
        if (error || !user) {
            return !user ? res.status(403).json({ message: 'User does not have enough permissions' }) : error
        }

        const videoRows = await client.query('SELECT blobname, uploadname, url, analysed FROM videos WHERE email = $1', [user.email]);
        return res.json(videoRows.rows)
        // make a generic function to test for the above;
        // retrieve json data and do magic
    })(req, res, next)
})

router.get('/labels', async (req, res, next) => {
    // req.allowedRoles = ['admin', 'owner', 'manager', 'tenant'];
    passport.authenticate('jwt', { session: false }, async (error, user) => {
        if (error || !user) {
            return !user ? res.status(403).json({ message: 'User does not have enough permissions' }) : error
        }

        const videoRows = await client.query('SELECT labeljson FROM labels WHERE email = $1', [user.email]);
        if(videoRows.rowCount == 0) {
            return res.json([]);
        }
        return res.json(Object.keys(videoRows.rows[0].labeljson));
    })(req, res, next)
})

module.exports = router
