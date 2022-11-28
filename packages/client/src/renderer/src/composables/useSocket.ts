import { ServerToClientEvents } from '@dotz/shared';
import { socket } from '@renderer/utils/socket';
import { Socket } from 'socket.io-client';
import { DisconnectDescription } from 'socket.io-client/build/esm/socket';

export const useSocket = () => socket;

interface SocketReservedEvents {
  connect: () => void;
  connect_error: (err: Error) => void;
  disconnect: (
    reason: Socket.DisconnectReason,
    description?: DisconnectDescription
  ) => void;
}
type AllEvents = ServerToClientEvents & SocketReservedEvents;

export const useSocketEvent = <T extends keyof AllEvents>(
  eventName: T,
  cb: AllEvents[T]
) => {
  socket.on(eventName, cb as any);

  onUnmounted(() => {
    socket.off(eventName, cb as any);
  });
};
