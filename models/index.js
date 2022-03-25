const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/mernAuthLesson'

mongoose.connect(MONGODB_URI)

const db = mongoose.connection 

db.once('open', () => console.log(`connect to mongo @ ${db.host}:${db.port}`))

db.on('error', err => {
  console.log('data center has burned down 🔥')
  console.log(err)
})

module.exports.User = require('./user')