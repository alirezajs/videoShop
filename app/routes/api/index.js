const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');

const apiv1 = require("./api-v0.0.1");
swaggerDocument.host = config.siteurlpure;
router.use("/api/v1", apiv1);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/swager.json', function (req, res, next) {
   return res.send(swaggerDocument);
});
module.exports = router;