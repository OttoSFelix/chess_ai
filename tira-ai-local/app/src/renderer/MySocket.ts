import { io } from "socket.io-client";

const socket = io("http://localhost:5000/gameconnection");
const opts = socket.io.opts;
socket.connect();

console.log("Connected to:", opts.hostname, opts.port);

export default socket;
