const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const {
    v4: uuidv4
} = require('uuid');


const feedRoutes = require('./routes/feed')
const errorController = require('./controllers/error')

const app = express()

// Multer
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, 'image-' + uuidv4().replace(/-/g, '') + '.' + file.originalname.split('.').pop());
    }
});
const multerFilter = (req, file, callback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

app.use(bodyParser.json())
app.use(multer({
    storage: multerStorage,
    fileFilter: multerFilter
}).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))

// Front end permissions
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

// Routes
app.use('/feed', feedRoutes)
app.use(errorController.get404)
app.use(errorController.getErrors)

// Database connect
mongoose.connect('mongodb://127.0.0.1:27017/messages', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(result => {
        app.listen(8080)
    })
    .catch(err => {
        console.log(err)
    })