const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const userToken = req.headers.authorization;

    if (!userToken) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      const token = userToken.split(" ")[1];
      const rootUser = await jwt.verify(token, "diviSecretKey");

      if (!rootUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = rootUser;
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = authMiddleware;
