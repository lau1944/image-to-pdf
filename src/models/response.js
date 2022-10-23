// status 1: success
// status 2: access-denied
// status 3: fail
const resWrapper = (req, res, next) => {
  const template = (status, message, body) => {
    return {
      status, message, body,
    }
  }

  res.fail = (code, message) => {
    return res.status(code).json(template(3, 'Server failed', message));
  }

  res.denied = (message) => {
    return res.status(401).json(template(2, 'Access denied', message));
  }

  res.success = (body) => {
    return res.status(200).json(template(1, 'Success', body));
  }

  next();
}

module.exports = resWrapper;