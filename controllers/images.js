const imgModel = require('../models/image');
const fs = require('fs')

module.exports.deleteImage = ((req, res, next) => {
  imgModel.findById(req.params.imageId)
    .then((image) => {
      if (!image) {
        res.send('not image');
      } else {
        imgModel.findByIdAndRemove(req.params.imageId)
        .then((deleteImage) => {
          res.send(deleteImage);
          fs.unlink(deleteImage.image, err => {
            if(err) {
              console.log(err)
            } else {
              console.log('succesfuly delete file')
            }
          })
          fs.unlink(deleteImage.thumbnail, err => {
            if(err) {
              console.log(err)
            } else {
              console.log('succesfuly delete file')
            }
          })
          fs.unlink(deleteImage.thumbnailSmall, err => {
            if(err) {
              console.log(err)
            } else {
              console.log('succesfuly delete file')
            }
          })
          fs.unlink(deleteImage.fullImage, err => {
            if(err) {
              console.log(err)
            } else {
              console.log('succesfuly delete file')
            }
          })
        })
        .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.send('incorrect id')
      }
      throw err;
    })
    .catch(next);
});