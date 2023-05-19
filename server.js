import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from "stream";
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobe from "@ffprobe-installer/ffprobe";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobe);

const PORT = 3000;
const HOST = process.env.HOST || "0.0.0.0";
const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, "/dist");

let fileSize = 0;

app.use(express.static(outputDir));

app.get("/", function (req, res) {
    res.sendFile(path.join(outputDir, "index.html"));
});

app.get("/audio", function (req, res){
    let audiopath = path.join(__dirname, "output.mp3");
    

    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };

    res.writeHead(200, head);
    fs.createReadStream(audiopath).pipe(res); 
});

(async () => {
    io.on("connection", (socket) => {
        socket.on("stream", (packet) => {
            let streamData = new Readable();
            streamData.push(packet);
            streamData.push(null);

            ffmpeg()
                .input(streamData)
                .inputFormat('webm')
                .toFormat('mp3')
                .outputOptions('-acodec', 'libmp3lame')
                .output('output.mp3')
                .on('end', function() {
                    let p = path.join(__dirname, "output.mp3");
                    fileSize = fs.statSync(p).size;
                })
                .on('error', function(err) {
                    console.log('Error converting buffer data to file: ' + err.message);
                })
                .run();
        });
    });

    server.listen(PORT, HOST, () => {
        console.log(`Listening on port ${PORT} OF ${HOST}`);
    });
})();

export {};
