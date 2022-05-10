const jwt = require('jsonwebtoken');

module.exports = {
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  },
  createJwtToken: async(user) => {
    let payload = {
        id: user._id,
    };
    let jwtToken = await jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: 360000});
    return jwtToken;
  },
};