const videoData = require('../mockData');
const fs = require('fs');

const videos = {
    getVideosData: function (req, res, next) {
        try {
            res.json(videoData);
        } catch (error) {
            console.error(error);
        }
    },
    getVideoData: function (req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            res.json(videoData[id]);
        } catch (error) {
            console.error(error);
        }

    },
    getVideoStrimingData: function (req, res, next) {
        try {
            const videoPath = `assets/${req.params.id}.mp4`;
            const videoStart = fs.statSync(videoPath);
            const fileSize = videoStart.size;
            const videoRange = req.headers.range;
            if (videoRange) {
                const parts = videoRange.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[0], 10) : fileSize - 1;
                const chunkSize = (end - start) + 1;
                const file = fs.createReadStream(videoPath, { start, end });
                console.log({ videoRange, parts, start, end, chunkSize, file });
                const head = {
                    'Content-Range': `bytes ${start}- ${end}/ ${chunkSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/mp4'
                }
                res.writeHead(206, head);
                file.pipe(res)

            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-type': 'video/mp4'
                }
                res.writeHead(200, head);
                fs.createReadStream(videoPath).pipe(res);
            }
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = videos;