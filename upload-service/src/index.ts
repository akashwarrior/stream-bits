import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { Chunks } from './chunks';
import { BlobService } from './blobService';
import { KafkaService } from './kafka';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer();
const chunks = Chunks.getInstance();
const blobService = BlobService.getInstance();
const kafka = KafkaService.getInstance();

app.post('/upload/initiate', upload.single('chunk'), (req, res) => {
    const { chunkIndex, totalChunks, filename } = req.body;
    const chunk = req.file?.buffer as Buffer;

    try {
        chunks.addChunk(filename, chunk, totalChunks, chunkIndex);
        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "error uploading file" });
    }
});

app.put('/upload/complete', upload.single('thumbnail'), async (req, res) => {
    const { title, description, author, filename, id } = req.body;
    const thumbnail = req.file?.buffer as Buffer;
    let thumbnailName = `${filename.split('.')[0]}.${req.file?.originalname.split('.')[req.file?.originalname.split('.').length - 1]}`;

    try {
        const chunksArray = chunks.getChunks(filename);
        const video = Buffer.concat(chunksArray);
        await blobService.uploadVideo(filename, video);
        chunks.deleteChunks(filename);
        await blobService.uploadImage(thumbnailName, thumbnail);
        await kafka.produce({
            messages: [{
                value: JSON.stringify({
                    userId: id,
                    filename,
                    title,
                    description,
                    author,
                    thumbnail: thumbnailName
                })
            }]
        });
        res.status(200).json({ "status": "success" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "error completing upload" });
    }
});

app.listen(3001, () => {
    console.log('Server running on port 3000');
});