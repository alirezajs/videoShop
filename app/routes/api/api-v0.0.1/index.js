const express = require('express');
const router = express.Router();


const forEveryOne = require("./public");
const forUser = require("./private");

router.use(forEveryOne);
// router.use(forUser);

module.exports = router;