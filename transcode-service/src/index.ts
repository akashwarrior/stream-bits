import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { KafkaService } from './kafka';
import { PrismaClient } from '@prisma/client';
import { BlobService } from './blobService';
import dotenv from "dotenv";
import fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegStatic as string);
dotenv.config();

const kafka = KafkaService.getInstance();
const blobService = BlobService.getInstance();
const prisma = new PrismaClient();

async function main() {
    await kafka.consume({
        callback: async (messages) => {
            const { userId, filename, title, description, author, thumbnail } = messages;
            await blobService.donwloadVideo(filename);
            let duration = 0;
            ffmpeg.ffprobe(`downloads/${filename}`, (err, metadata) => {
                duration = metadata.format.duration ?? 0;
            })
            const video = await prisma.video.create({
                data: {
                    title,
                    description,
                    author,
                    duration,
                    userId: Number(userId),
                    thumbnail: `http://localhost:10000/devstoreaccount1/thumbnail/${thumbnail}`,
                    url: `http://localhost:10000/devstoreaccount1/upload/${filename}`
                }
            });
            await convertToHLS({ fileName: filename, videoId: video.id });
        }
    })
}

main();

const convertToHLS = async ({ fileName, videoId }: { fileName: string, videoId: string }) => {
    const resolutions = [
        {
            resolution: '320x180',
            videoBitrate: '500k',
            audioBitrate: '64k',
        },
        {
            resolution: '854x480',
            videobitrate: '1000k',
            audioBitrate: '128k',
        },
        {
            resolution: '1280x720',
            videoBitrate: '2500k',
            audioBitrate: '192k',
        }
    ]

    const varientPlaylists = [];

    for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
        const outputFileName = `${fileName.replace('.', '_')}_${resolution}.m3u8`;
        const segmentFileName = `${fileName.replace('.', '_')}_${resolution}_%03d.ts`;

        await new Promise((resolve, reject) => {
            ffmpeg(`downloads/${fileName}`)
                .outputOptions([
                    `-c:v h264`,
                    `-b:v ${videoBitrate}`,
                    `-c:a aac`,
                    `-b:a ${audioBitrate}`,
                    `-vf scale=${resolution}`,
                    `-f hls`,
                    `-hls_time 10`,
                    `-hls_list_size 0`,
                    `-hls_segment_filename output/${segmentFileName}`
                ])
                .output(`output/${outputFileName}`)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });

        varientPlaylists.push({
            resolution,
            outputFileName
        });
    }

    let masterPlaylist = varientPlaylists.map((varientPlaylist) => {
        const { resolution, outputFileName } = varientPlaylist;
        const bandwidth = resolution === '320x180' ? 676800 : resolution === '854x480' ? 1353600 : 3230400;
        return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}`;
    }).join('\n');

    masterPlaylist = '#EXTM3U\n' + masterPlaylist;
    const masterPlaylistFileName = `${fileName.replace('.', '_')}_master.m3u8`;
    fs.writeFileSync(`output/${masterPlaylistFileName}`, masterPlaylist);

    fs.unlinkSync(`downloads/${fileName}`);

    const videos = fs.readdirSync('output');
    for (const video of videos) {
        const videoBuffer = fs.readFileSync(`output/${video}`);
        await blobService.uploadFile(`${videoId}/${video}`, videoBuffer);
        fs.unlinkSync(`output/${video}`);
    }

    await prisma.video.update({
        where: { id: videoId },
        data: {
            url: `http://localhost:10000/devstoreaccount1/video/${videoId}/${masterPlaylistFileName}`
        }
    })
}