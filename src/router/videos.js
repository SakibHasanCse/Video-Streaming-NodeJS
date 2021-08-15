const express = require('express');
const router = express.Router();
const videos = require('../services/videos');

router.get('/', videos.getVideosData);
router.get('/:id/data', videos.getVideoData);
router.get('/video/:id', videos.getVideoStrimingData);

module.exports = router;