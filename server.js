var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io'),
    fs = require('fs'),
    path = require('path'),
    dotenv = require('dotenv'),
    mongodb = require('mongodb')

dotenv.config();

const VideoRouter = require('./src/router/videos');
const mongo_url = process.env.MONGO_URL;

app.get('/upload-video', (req, res) => {
    mongodb.MongoClient.connect(mongo_url, (err, client) => {
        if (error) {
            res.json(error);
            return;
        }
        const db = client.db('videos');
        const bucket = new mongodb.GridFSBucket(db);
        const videoUploadStream = bucket.openDownloadStream('bigbuck');
        const videoReadStream = bucket.openReadStream('./hdvideo.mp4');
        videoReadStream.pipe(videoUploadStream);
        res.status(200).send("Done...");
    })
})

app.get("/mongo-video", function (req, res) {
    mongodb.MongoClient.connect(url, function (error, client) {
        if (error) {
            res.status(500).json(error);
            return;
        }

        // Check for range headers to find our start time
        const range = req.headers.range;
        if (!range) {
            res.status(400).send("Requires Range header");
        }

        const db = client.db('videos');
        // GridFS Collection
        db.collection('fs.files').findOne({}, (err, video) => {
            if (!video) {
                res.status(404).send("No video uploaded!");
                return;
            }

            // Create response headers
            const videoSize = video.length;
            const start = Number(range.replace(/\D/g, ""));
            const end = videoSize - 1;

            const contentLength = end - start + 1;
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
            };

            // HTTP Status 206 for Partial Content
            res.writeHead(206, headers);

            // Get the bucket and download stream from GridFS
            const bucket = new mongodb.GridFSBucket(db);
            const downloadStream = bucket.openDownloadStreamByName('bigbuck', {
                start
            });

            // Finally pipe video to response
            downloadStream.pipe(res);
        });
    });
});

app.use('/', VideoRouter);

const port = process.env.PORT || 8000;

app.listen(port, function () {
    console.log('server listing on port ' + port);
});

