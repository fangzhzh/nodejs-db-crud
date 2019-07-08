const express = require('express')
const router = express.Router()
const Document = require('../models/Document')

router.get('/Requests', (req, res, next) => {
    req.app.locals.db.collection('documents').find().sort({title: 1}).limit(10).toArray((err, result) => {
        if (err) {
          res.status(400).send({'error': err})
        }
        if (result === undefined || result.length === 0) {
          res.status(400).send({'error':'No documents in database'})
        } else {
          res.status(200).send(result)
        }
      })
})

router.post('/Logon/UserLogin', (req, res, next) => {
    console.log("post /Logon/UserLogin")
    var today = new Date();
    var date = today.toDateString() + ", " + today.toLocaleTimeString();
    const newDocument = new Document(date, "Logon/UserLogin", req.body)
    req.app.locals.db.collection('documents').insertOne({
      newDocument
    }, (err, result) => {
      if (err) {
        res.status(400).send({'error': err})
        return
      }
      var ret = `
      {
        "Code": 0,
        "Message": "Success",
        "Value": {
          "ServiceUri": "test",
          "SessionID": "test",
          "WorkerID": "test"
        }
       }
        `;
      res.status(200).send(ret)
    })
  })

  router.post('/Tracking/SendPosition', (req, res, next) => {
    console.log("post /Tracking/SendPosition")
    var today = new Date();
    var date = today.toDateString() + ", " +today.toLocaleTimeString();
    const newDocument = new Document(date, "/Tracking/SendPosition", req.body)
    req.app.locals.db.collection('documents').insertOne({
      newDocument
    }, (err, result) => {
      if (err) {
        res.status(400).send({'error': err})
        return
      }
      var ret = `
      {
        "Code": 0,
        "Message": "Success"
      }
      `
      res.status(200).send(ret)
    })
  })

  module.exports = router