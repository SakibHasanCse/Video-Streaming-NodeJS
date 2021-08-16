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
app.use('/', VideoRouter);

const port = process.env.PORT || 8000;

app.listen(port, function () {
    console.log('server listing on port ' + port);
});

