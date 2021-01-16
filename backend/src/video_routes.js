const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const client = require('./db')

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
          // const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          await client.query('INSERT INTO videos (email, blobname, uploadname, analyzed) VALUES ($1::text, $2::text, $3::text, $4::number)', [user.email, blob.name, req.body.name, 0])
          res.json({ blob: blob.name })
        })
        blobStream.end(req.file.buffer)
      } catch (err) {
        next(err)
      }
    })(req, res, next)
})

router.post('/analyze', async (req, res, next) => {
    // req.allowedRoles = ['admin', 'owner', 'manager', 'tenant'];
    passport.authenticate('jwt', { session: false }, async (error, user) => {
        if (error || !user) {
            return !user ? res.status(403).json({ message: 'User does not have enough permissions' }) : error
        }

        const videoRows = await client.query('SELECT * FROM videos WHERE blobname = $1::text AND analyzed=0', [req.body.blobname]);
        if(videoRows.rowCount == 0) {
            return res.status(405).json({message: "Video not found or is already analyzed"});
        }
        const videoRow = videoRows.rows[0];

        // const gcsUri = 'gs://cloud-samples-data/video/cat.mp4';
        const request = {
            inputUri: `https://storage.googleapis.com/${bucket.name}/${videoRow.blobname}`,
            features: ['LABEL_DETECTION'],
        };
        
        // Execute request
        const [operation] = await client.annotateVideo(request);
        const annotations = operationResult.annotationResults[0];

        // Gets labels for video from its annotations
        const labels = annotations.segmentLabelAnnotations;
        labels.forEach(label => {
            console.log(`Label ${label.entity.description} occurs at:`);
            label.segments.forEach(segment => {
                segment = segment.segment;
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
                console.log(
                `\tStart: ${segment.startTimeOffset.seconds}` +
                    `.${(segment.startTimeOffset.nanos / 1e6).toFixed(0)}s`
                );
                console.log(
                `\tEnd: ${segment.endTimeOffset.seconds}.` +
                    `${(segment.endTimeOffset.nanos / 1e6).toFixed(0)}s`
                );
            });
        });
    })(req, res, next)
})

module.exports = router
