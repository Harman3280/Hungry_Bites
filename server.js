require('dotenv').config()
// return a object to be stored in app
const express = require('express')
const app = express() 
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport')
const { request } = require('http')
const { response } = require('express')
/*Path is an inbuilt node module used here*/
/* PORT cond. Checks if our 3000 port is available
  on live server on not*/

// Database connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...Yup!!');
}).catch(err => {
    console.log('Connection failed...')
});

// Session store
/*let mongoStore = new MongoDbStore({
            mongooseConnection: connection,
            collection: 'sessions'
        })*/




// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({mongoUrl: url, collection: 'sessions'}),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour cookie life
}))

// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Global Middleware used to use sessions(in our case) in frontend
app.use((request,response,next)=>{
    response.locals.session = request.session
    response.locals.user = request.user
    next()
})


//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//Routes must be placed after Layout so that our layout works
//Here we are defining our all routes in web.js file and importing them here using 
//initRoutes function and passing the (app) instance of express in the function
require('./routes/web.js')(app)


// Fat arrow new syntax old syntax : function()
app.listen(PORT, ()=>{

    console.log(`Listening on port  ${PORT}`)
}) 