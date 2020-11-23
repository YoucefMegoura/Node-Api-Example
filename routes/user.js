const express = require("express");
const userController = require("../controllers/user");
const { body } = require("express-validator");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/status", isAuth, userController.getUserStatus);

router.put(
    "/status",
    isAuth,
    [body("status").trim().not().isEmpty()],
    userController.putUpdateUserStatus
);

module.exports = router;
