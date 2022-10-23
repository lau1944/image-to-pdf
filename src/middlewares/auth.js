
const tokenValidate = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.denied('Token should not be empty');
  }

  if (token !== process.env.ACCESS_TOKEN) {
    return res.denied('Access denined');
  }

  next()
}

module.exports = {
  tokenValidate
};