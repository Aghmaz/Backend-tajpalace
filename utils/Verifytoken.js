const jwt = require('jsonwebtoken');
const { createError } = require('./error');

// VERIFY THE TOKEN
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) res.status(403).json("Token is not valid!");
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("token is not found");
    }
}

// VERIFY THE USER
const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
          next();
        } else {
          res.status(403).json("You are not alowed to do that!");
        }
      });
};

// VERIFY ADMIN
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next()
            console.log(res)
        } else {
            return next(createError(403, "You are not admin!"));
        }
    })
}
module.exports = {
    verifyToken, verifyUser, verifyAdmin
}