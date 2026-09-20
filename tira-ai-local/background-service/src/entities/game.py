from entities.ai_directory import AiDirectory


class Game:
    """Represents a game session.

    Args:
        ai_directory (AiDirectory): An instance of AiDirectory representing the AI directory.

    Attributes:
        ai_directory (AiDirectory): An instance of AiDirectory representing the AI directory.
    """

    def __init__(self, ai_directory: AiDirectory) -> None:
        self.ai_directory = ai_directory
        self.ai_directory.run_ai()

    def add_move(self, move):
        self.ai_directory.move(move)

    def get_move(self):
        return self.ai_directory.play()

    def set_board(self, board_position):
        self.ai_directory.board(board_position)

    def reset_board(self):
        self.ai_directory.reset()

    def get_pid(self):
        return self.ai_directory.get_pid()

    def kill(self):
        return self.ai_directory.kill_process()

    def poll(self):
        return self.ai_directory.process.poll()
