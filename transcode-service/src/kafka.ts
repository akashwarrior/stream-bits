import { Consumer, Kafka } from "kafkajs";

export class KafkaService {
    private kafka: Kafka;
    private consumer: Consumer;
    private static instance: KafkaService;

    private constructor() {
        this.kafka = new Kafka({
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: ['localhost:9092']
        });
        this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID as string });
    }

    public static getInstance() {
        if (!KafkaService.instance) {
            KafkaService.instance = new KafkaService();
        }

        return KafkaService.instance;
    }

    public async consume({ callback }: {
        callback: (messages: {
            userId: string,
            filename: string,
            title: string,
            description: string,
            author: string,
            thumbnail: string
        }) => void
    }) {
        try {
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: process.env.KAFKA_TOPIC as string, fromBeginning: true });
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const value = message.value!.toString();
                    callback(JSON.parse(value));
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
}