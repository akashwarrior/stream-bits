import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

export class BlobService {
    private blobServiceClient: BlobServiceClient;
    private videoContainerClient: ContainerClient;
    private transcodeContainerClient: ContainerClient;
    private static instance: BlobService;

    private constructor() {
        this.blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING as string);
        this.videoContainerClient = this.blobServiceClient.getContainerClient(process.env.VIDEO_CONTAINER_NAME as string);
        this.transcodeContainerClient = this.blobServiceClient.getContainerClient(process.env.TRANSCODE_CONTAINER_NAME as string);
        this.transcodeContainerClient.createIfNotExists({
            access: 'container',
            metadata: { cors: '*' }
        });
    }

    public static getInstance() {
        if (!BlobService.instance) {
            BlobService.instance = new BlobService();
        }
        return BlobService.instance;
    }

    public async donwloadVideo(filename: string) {
        try {
            const blockBlobClient = this.videoContainerClient!.getBlockBlobClient(filename);
            await blockBlobClient.downloadToFile('downloads/' + filename);
        } catch (err) {
            throw new Error("Error : " + err);
        }
    }


    public async uploadFile(filename: string, file: Buffer) {
        try {
            const blockBlobClient = this.transcodeContainerClient.getBlockBlobClient(filename);
            await blockBlobClient.upload(file, file.length);
        } catch (err) {
            throw new Error("Error : " + err);
        }
    }
}