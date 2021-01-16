// db.js
const pg = require('pg')
const fs = require('fs')

const config = {
  connectionString: "postgres://fugazi:computervision@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/klutzy-fish-183.defaultdb?sslmode=verify-full",
  ssl: {
      ca: fs.readFileSync('./cc-ca.crt')
          .toString()
  }
};

// Create a pool.
var client = new pg.Client(config);

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

module.exports = client;