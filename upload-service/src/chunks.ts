export class Chunks {
    private chunks: Map<string, Buffer[]>;
    private static instance: Chunks;

    private constructor() {
        this.chunks = new Map();
    }

    public static getInstance(): Chunks {
        if (!Chunks.instance) {
            Chunks.instance = new Chunks();
        }
        return Chunks.instance;
    }

    public addChunk(id: string, chunk: Buffer, totalChunks: number, chunkIndex: number): void {
        if (!this.chunks.has(id)) {
            this.chunks.set(id, new Array(totalChunks).fill(null));
        }

        this.chunks.get(id)![chunkIndex] = chunk;
    }

    public getChunks(id: string): Buffer[] {
        const chunks = this.chunks.get(id);
        if (!chunks) {
            throw new Error('File not found');
        }
        chunks.forEach((chunk, index) => {
            if (!chunk) {
                throw new Error(`Chunk ${index} is missing`);
            }
        });
        return chunks;
    }

    public deleteChunks(id: string): void {
        this.chunks.delete(id);
    }
}