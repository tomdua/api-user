const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post("/register", UserController.regsiter);

router.post("/login", UserController.login);

router.get("/allusers",  UserController.allUser);

router.use(checkAuth)
router.get('/userdelete', UserController.userDelete);

router.use(checkAuth)
router.put("/updatename", UserController.updateName)

module.exports = router;