const express = require('express');
require('dotenv');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const auth = require('./src/middlewares/auth');
const resWrapper = require('./src/models/response');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const sharp = require("sharp");
const imgToPDF = require('image-to-pdf');
const fs = require('fs');
const img = require('./src/utils/img');

const app = express();
const port = process.env.PORT || 8080;

const MAX_PHOTO_SIZE = 25 * 1000 * 1000

app.use(resWrapper);

//app.use(auth.tokenValidate);

app.use(helmet());

app.use(hpp());

app.use(errorHandler);

//serving public file
app.use(express.static(__dirname));

// Parse body stream
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(__dirname + '/src/views'));

const uploadForm = upload.fields([{ name: 'photo', maxCount: 1 }]);
// post photo
app.post('/photo', uploadForm, async (req, res, next) => {
  const { rotateDegree = 0, sizeType = 'A4', outputFormat = 'pdf' } = req.query;
  const photo = req.files?.photo?.shift();

  if (!photo) {
    return res.fail(403, 'Photo should not be empty');
  }
  
  if (photo.mimetype !== 'image/png' && photo.mimetype !== 'image/jpeg' && photo.mimetype !== 'image/jpg') {
    return res.fail(403, 'Photo type should be png or jpeg or jpg');
  }


  let imgPath = photo.path;

  if (photo.size > MAX_PHOTO_SIZE) {
    // do compress
    await sharp(photo.buffer)
      .png({ quality: 70 })
      .jpeg({ quality: 70 })
      .toFile(imgPath);
  }

  if (rotateDegree !== 0) {
    await img.rotate(imgPath, rotateDegree);
  }

  imgToPDF([imgPath], imgToPDF.sizes[sizeType]).pipe((res));
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})

function errorHandler(err, req, res, next) {
  console.log(err.message);
  res.fail(500, 'Unexpected error')
}

