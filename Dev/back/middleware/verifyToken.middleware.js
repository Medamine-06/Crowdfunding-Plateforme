const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {
  console.log('Received headers:', req.headers);
  
  var token = req.headers["authorization"];
  console.log('Token from request:', token);
  
  if (!token) {
      console.log('No token provided');
      return res.status(403).send({'forbidden': "A token is required for authentication"});
  }
  
  if (req.headers['authorization']) {
      token = token.replace(/^Bearer\s+/, "");
      console.log('Cleaned token:', token);
  }
  
  try {
      const decoded = jwt.verify(token, process.env.SECRETKEY || '123');
      console.log("Decoded token:", decoded);
      req.user = decoded;
  } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).send({'UnAuthorized': "Invalid Token"});
  }
  return next();
}