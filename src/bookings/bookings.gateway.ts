import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class BookingsGateway {
    @WebSocketServer()
    server: Server;

    emitBookingCreated(data: any) {
        this.server.emit(
            'booking-created',
            data,
        );
    }
}