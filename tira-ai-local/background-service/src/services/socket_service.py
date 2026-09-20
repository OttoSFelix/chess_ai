from flask_socketio import SocketIO


class SocketService:
    """Handles socket communications.

    Args:
        socketio (SocketIO): An instance of SocketIO for handling socket connections.

    Attributes:
        socketio (SocketIO): An instance of SocketIO for handling socket connections.
    """

    def __init__(self, socketio: SocketIO) -> None:
        self.socketio: SocketIO = socketio

    def send_log(self, msg: str):
        self.socketio.emit("logs", msg, namespace="/gameconnection")

    def move_to_front(self, move):
        self.socketio.emit("move_to_front", move, namespace="/gameconnection")

    def send_runtime_error(self):
        self.socketio.emit("runtime_error", namespace="/gameconnection")
