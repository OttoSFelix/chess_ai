import threading
from time import perf_counter
from entities.ai_directory import AiDirectory
from entities.game import Game
from services.socket_service import SocketService


class GameService:
    """A service class for managing game-related operations.

    Args:
        socket_service (SocketService): An instance of SocketService for
            handling socket communications.

    Attributes:
        game (Game | None): An instance of the Game class representing the
            current game, or None if no game is active.
        socket_service (SocketService): An instance of SocketService for
            handling socket communications.
        wait_thread (threading.Thread | None): The thread waiting for the AI response.
    """

    def __init__(self, socket_service: SocketService):
        self.game: Game | None = None
        self.socket_service = socket_service
        self.wait_thread: threading.Thread | None = None

    def start_game(self, ai_directory: AiDirectory, board_position, runsetup):
        self.socket_service.send_log(
            f"Starting AI process from {ai_directory.ai_path}..."
        )
        try:
            if runsetup:
                self.socket_service.send_log(
                    f"Running setup.sh in {ai_directory.ai_path}/tiraconfig/setup.sh..."
                )
                ai_directory.run_setup()
            self.game = Game(ai_directory)
            self.socket_service.send_log(
                f"Success! Running AI opponent in process {ai_directory.get_pid()}"
            )
        except RuntimeError as e:
            self.socket_service.send_log(f"Error starting AI:\n{str(e)}")
            self.socket_service.send_runtime_error()
            return
        except FileNotFoundError as e:
            self.socket_service.send_log(f"Error starting AI:\n{str(e)}")
            self.socket_service.send_runtime_error()
            return

        try:
            if board_position != "":
                self.game.set_board(board_position)
            else:
                self.game.reset_board()
        except RuntimeError as e:
            self.socket_service.send_log(
                f"Setting board with {board_position} failed:\n{str(e)}"
            )

    def _wait_for_move(self):
        if self.game is None:
            return

        error = ""
        output = ""
        logs = []
        end_time = 0.0

        start_time = perf_counter()
        try:
            output, logs = self.game.get_move()
        except RuntimeError as e:
            error = str(e)
        if output != "":
            end_time = (perf_counter() - start_time) * 1000
            self.socket_service.move_to_front(output)
        logs_lined = "\n".join(logs)
        if error != "":
            self.socket_service.send_log(error)
            self.socket_service.send_runtime_error()
        else:
            self.socket_service.send_log(
                f"Recieved Move: {output} | Time: {round(end_time)} ms | Logs:\n{logs_lined}"
            )

    def move_to_back(self, move: str, return_move: bool):
        if self.game is None:
            self.socket_service.send_log("No game detected!")
            return None

        if move != "":
            self.game.add_move(move)

        if return_move:
            if self.wait_thread is not None and self.wait_thread.is_alive():
                self.socket_service.send_log("AI is already calculating a move!")
                return self.wait_thread

            self.wait_thread = threading.Thread(target=self._wait_for_move, daemon=True)
            self.wait_thread.start()
            return self.wait_thread

        return None

    def set_board(self, board_position):
        self.socket_service.send_log(f"Setting AI board to {board_position}")
        try:
            self.game.set_board(board_position)
        except RuntimeError as e:
            self.socket_service.send_log(f"Setting board failed: \n {str(e)}")

    def kill_process(self):
        if self.game is not None:
            if self.game.poll() is not None:
                self.socket_service.send_log("No active process!")
            else:
                return_code = self.game.kill()
                self.socket_service.send_log(
                    (
                        f"Killed process {self.game.ai_directory.get_pid()} "
                        f"with return code {return_code}"
                    )
                )
