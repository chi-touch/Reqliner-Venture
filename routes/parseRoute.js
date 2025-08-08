const express = require('express');
const router = express.Router();
const { handleReqline } = require('../controllers/reqlineController');

router.post('/', handleReqline);

module.exports = router;
