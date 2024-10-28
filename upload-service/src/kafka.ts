import { Kafka, Producer } from "kafkajs";

export class KafkaService {
    private kafka: Kafka;
    private producer: Producer;
    private static instance: KafkaService;

    private constructor() {
        this.kafka = new Kafka({
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: ['localhost:9092']
        });
        this.producer = this.kafka.producer();
    }

    public static getInstance() {
        if (!KafkaService.instance) {
            KafkaService.instance = new KafkaService();
        }

        return KafkaService.instance;
    }

    public async produce({ messages }: { messages: [{ value: string }] }) {
        try {
            await this.producer.connect();
            await this.producer.send({
                topic: process.env.KAFKA_TOPIC as string,
                messages,
            });
        } catch (err) {
            console.error(err);
        } finally {
            await this.producer.disconnect();
        }
    }
}