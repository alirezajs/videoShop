const express = require('express');
const router = express.Router();


const apiv1 = require("./api-v0.0.1");

router.use("/api/v1", apiv1);
module.exports = router;