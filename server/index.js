//node modules
const path = require('path');
const express = require("express");
const morgan = require ("morgan");
const compression = require('compression')
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

//project modules
const db = require('../db')


const app = express();
const port = process.env.PORT || 4000;
const sessionStore = new SequelizeStore({db})


//if (process.env.NODE_ENV !== 'production') require('../secrets')

// passport registration
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})


app.use(morgan('dev'))

//body-parsing via express's built in body-parser (as of Express 4.16+)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// compression middleware
app.use(compression())

// session middleware with passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'what should have been is',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())

// auth and api routes
app.use('/auth', require('./auth'))
app.use('/api', require('./api'))

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'build')))

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
} else {
    next()
}
})

// sends index.html
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

// error handling endware
app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
})

const syncDb = () => db.sync({alter:true})

const startServer = async function(){
    await sessionStore.sync()
    await syncDb()
    app.listen(port, () => console.log("server is listening on PORT:", port))
    
}

startServer();
