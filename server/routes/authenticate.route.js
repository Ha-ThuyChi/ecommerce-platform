const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // take the token from the headers("Bearer ...")
    if (!token) {
      return res.status(401).send("No token.") // Return if found no token
    };
    // check if token is valid
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // if (err.name === "JsonWebTokenError") {
        //   return res.status(403).send("Invalid token.");
        // };
        if (err.name === "TokenExpiredError") {
          res.status(401).send("Token expired.") // Return if token is expired
        }
      } else {
        req.user = user;
        next(); // Authenticate successfully
      }
  });
};

const authorizeUser = (roles) => {
  return (req, res, next) => {
    if (roles.length && !req.user.roles.some(r => roles.includes(r))) {
        // user's role is not authorized
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // authentication and authorization successful
    next();
  };
};

// const verifyOwnership = () => {
//   return (req, res, next) => {
    
//     next();
//   };
// }
module.exports = { authenticateToken, authorizeUser};