//node modules
import path from "path";
import express from "express";
import morgan from "morgan";

//project modules
import db from '../db'


const app = express();
const PORT = 8080;

app.use(morgan('dev'))

//body-parsing via express's built in body-parser (as of Express 4.16+)
app.use(express.json());
app.use(express.urlencoded());


// auth and api routes
app.use('/auth', require('./auth'))
app.use('/api', require('./api'))

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

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
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

// error handling endware
app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
})

const syncDb = () => db.sync()

const startServer = () => {
    syncDb()
    .then(()=> {
        app.listen(PORT, ()=> console.log("server is listening on PORT:", PORT))
    })
}

startServer();
