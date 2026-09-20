"""
This module initializes a Flask application for a game AI testing platform. It sets up SocketIO for real-time communication 
with clients, allows CORS, and defines event handlers for starting a game, moving a move to the back, setting the board, 
and killing the process. It also includes a function to run the Flask app with SocketIO.

Classes:
    - None

Functions:
    - run(): Runs the Flask app with SocketIO.

Event Handlers:
    - io_startgame(project_path, board_position, runsetup): Event handler for starting a game.
    - io_move_to_back(move, return_move): Event handler for moving a move to the back.
    - io_set_board(board): Event handler for setting the board.
    - io_kill_process(): Event handler for killing the process.
"""

from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

from entities.ai_directory import AiDirectory
from services.game_service import GameService
from services.socket_service import SocketService

app = Flask("game-ai-testing-platform")
app.config.update(
    {
        "SECRET_KEY": "secret!",
    }
)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

socketService: SocketService = SocketService(socketio)
gameService: GameService = GameService(socketService)


@socketio.on("startgame", namespace="/gameconnection")
def io_startgame(project_path, board_position, runsetup):
    ai_directory = AiDirectory(project_path)
    gameService.start_game(ai_directory, board_position, runsetup)


@socketio.on("move_to_back", namespace="/gameconnection")
def io_move_to_back(move, return_move):
    gameService.move_to_back(move, return_move)


@socketio.on("set_board", namespace="/gameconnection")
def io_set_board(board):
    gameService.set_board(board)


@socketio.on("kill", namespace="/gameconnection")
def io_kill_process():
    gameService.kill_process()


def run():
    socketio.run(
        app,
        host="0.0.0.0",
        port=5000,
        debug=True,
        # TODO: Fix werkzeug
        allow_unsafe_werkzeug=True,
    )


if __name__ == "__main__":
    run()
