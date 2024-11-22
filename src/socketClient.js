// Config Socket.io
// https://socket.io/how-to/use-with-react
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constant'
export const socketIoInstance = io(API_ROOT)
