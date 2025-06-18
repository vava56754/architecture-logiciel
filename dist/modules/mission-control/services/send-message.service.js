"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageService = void 0;
const uuid_1 = require("uuid");
class SendMessageService {
    constructor(webSocketService) {
        this.webSocketService = webSocketService;
        this.messageStatuses = new Map();
        this.failedMessages = [];
    }
    async sendMessage(message) {
        this.messageStatuses.set(message.id, 'pending');
        try {
            const success = await this.webSocketService.send(message);
            if (success) {
                this.messageStatuses.set(message.id, 'sent');
                console.log(`Message ${message.id} sent successfully`);
                return true;
            }
            else {
                this.messageStatuses.set(message.id, 'failed');
                this.failedMessages.push(message);
                console.error(`Failed to send message ${message.id}`);
                return false;
            }
        }
        catch (error) {
            console.error('Error sending message:', error);
            this.messageStatuses.set(message.id, 'failed');
            this.failedMessages.push(message);
            return false;
        }
    }
    async sendBroadcast(message) {
        // Ajouter un flag broadcast
        const broadcastMessage = {
            ...message,
            to: 'broadcast'
        };
        return this.sendMessage(broadcastMessage);
    }
    getMessageStatus(messageId) {
        return this.messageStatuses.get(messageId) || 'failed';
    }
    async retryFailedMessages() {
        console.log(`Retrying ${this.failedMessages.length} failed messages`);
        const messagesToRetry = [...this.failedMessages];
        this.failedMessages = [];
        for (const message of messagesToRetry) {
            await this.sendMessage(message);
        }
    }
    getFailedMessagesCount() {
        return this.failedMessages.length;
    }
    async sendCommandToRover(command) {
        const message = {
            id: (0, uuid_1.v4)(),
            from: 'mission-control',
            to: 'rover',
            content: command,
            timestamp: new Date(),
            type: 'command'
        };
        return this.sendMessage(message);
    }
}
exports.SendMessageService = SendMessageService;
