const videoData = request('../mockData');
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
            const videoPath = `../../assets/${req.params.id}/.mp4`;
            const videoStart = fs.statSync(videoPath);
            const fileSize = videoStart.size;
            const videoRange = req.headers.range;

            if (videoRange) {

            }
        } catch (error) {
            console.error(error);
        }
    }

}

export default videos;