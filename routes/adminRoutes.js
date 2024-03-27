const express = require("express");
const router = express.Router();
const { addUser, login, getUser, getAllUserData, updateUser } = require("../controllers/Controller");
// const authMiddleware = require("../Middleware/authMiddleware");
router.post("/",  addUser);
router.post("/user", login);
router.get("/userData", getAllUserData);
router.get("/:latitude", getUser);
router.patch("/:userId", updateUser);

module.exports = router;
