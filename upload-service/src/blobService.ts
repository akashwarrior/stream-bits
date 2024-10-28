import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

export class BlobService {
    private blobServiceClient: BlobServiceClient | null = null;
    private videoContainerClient: ContainerClient | null = null;
    private imageContainerClient: ContainerClient | null = null;
    private static instance: BlobService;

    private constructor() {
        this.createContainer();
    }

    public static getInstance(): BlobService {
        if (!BlobService.instance) {
            BlobService.instance = new BlobService();
        }
        return BlobService.instance;
    }

    private async createContainer(): Promise<void> {
        this.blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING as string);
        this.videoContainerClient = this.blobServiceClient.getContainerClient(process.env.VIDEO_CONTAINER_NAME as string);
        this.imageContainerClient = this.blobServiceClient.getContainerClient(process.env.IMAGE_CONTAINER_NAME as string);
        await this.blobServiceClient.setProperties({
            cors: [{
                allowedOrigins: "*",
                allowedMethods: "GET,POST,PUT",
                allowedHeaders: "*",
                exposedHeaders: "*",
                maxAgeInSeconds: 3600
            }]
        });

        await this.videoContainerClient.createIfNotExists({
            access: "blob",
            metadata: { cors: '*' }
        });
        await this.imageContainerClient.createIfNotExists({
            access: "blob",
            metadata: { cors: '*' }
        });
    }

    public async uploadImage(filename: string, file: Buffer): Promise<void> {
        try {
            const blockBlobClient = this.imageContainerClient!.getBlockBlobClient(filename);
            await blockBlobClient.upload(file, file.length);
        } catch (err) {
            throw new Error("Error : " + err);
        }
    }

    public async uploadVideo(filename: string, file: Buffer): Promise<void> {
        try {
            const blockBlobClient = this.videoContainerClient!.getBlockBlobClient(filename);
            await blockBlobClient.upload(file, file.length);
        } catch (err) {
            throw new Error("Error : " + err);
        }
    }
}