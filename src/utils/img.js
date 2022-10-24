const jimp = require('jimp');

const rotate = async (path, degree) => {
  const image = await jimp.read(path);

  return new Promise((resolve, reject) => {
    image.rotate(degree, function (err) {
      if (err) reject(err);
    })
      .write(path, () => {
        resolve(path);
      });
  })
}

module.exports = {
  rotate
};