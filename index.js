const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const router = express.Router()


const dbName = process.env.NODE_ENV === 'dev' ? 'database-test' : 'database' 
const url = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${dbName}:27017?authMechanism=SCRAM-SHA-1&authSource=admin`
const options = {
  useNewUrlParser: true, 
  reconnectTries: 60, 
  reconnectInterval: 1000
}
const routes = require('./routes/routes.js')
const routeCorehub = require('./routes/corehub.js')
const port = process.env.PORT || 80
const app = express()
const http = require('http').Server(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', routes)
app.use('/', routeCorehub)
app.use((req, res) => {
  res.status(404)
})
console.log(" after import all route!")
var route, routeList = [];

app._router.stack.forEach(function(middleware){
    if(middleware.route){ // routes registered directly on the app
      routeList.push(middleware.route);
    } else if(middleware.name === 'router'){ // router middleware 
        middleware.handle.stack.forEach(function(handler){
            route = handler.route;
            route && routeList.push(route);
        });
    }
});

console.log("routes: ", routeList)
MongoClient.connect(url, options, (err, database) => {
  if (err) {
    console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`)
    process.exit(1)
  }
  app.locals.db = database.db('api')
  http.listen(port, () => {
    console.log("Listening on port " + port)
    app.emit('APP_STARTED')
  })
})

module.exports = app