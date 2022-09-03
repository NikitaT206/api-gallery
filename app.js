const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const imgModel = require('./models/image');
const { deleteImage } = require('./controllers/images');
const ExifImage = require('exif').ExifImage;
const sharp = require('sharp')

require('dotenv/config');

const {PORT, MONGO_URL} = process.env

const app = express();
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Credentials', true);
    return res.end();
  }
  return next();
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })


app.get('/', (req, res, next) => {
  imgModel.find({}).then(images => res.send(images)).catch(next)
})

app.post("/", upload.single('image'), (req, res, next) => {
  const resizeImagePath = 'uploads/' + 'thumbnails-' + new Date().toISOString() + req.file.originalname

  sharp(req.file.path)
    .resize(400, 400)
    .toFile(resizeImagePath, (err, resizeImage) => {
      if (err) {
        console.log(err);
      } else {
        console.log(resizeImage);
        new ExifImage({image: req.file.path}, (err, exif) => {
          const image = {
            name: req.body.name,
            category: req.body.category,
            image: req.file.path,
            thumbnail: resizeImagePath,
            exif: exif || null,
            uploadDate: new Date().toISOString()
          }
          imgModel.create(image).then(image => res.send(image)).catch(next)
      })
    }
  })
 
 
})

app.delete('/:imageId', deleteImage)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? err
      : message,
  });

  return next();
});

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});