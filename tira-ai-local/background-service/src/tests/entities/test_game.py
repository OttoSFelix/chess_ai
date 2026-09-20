from unittest import TestCase
from unittest.mock import Mock

from entities.game import Game


class TestGame(TestCase):
    def setUp(self) -> None:
        self.mock_ai_directory = Mock()
        self.game = Game(self.mock_ai_directory)

    def test_game_calls_ai_directory_run_ai(self):
        self.mock_ai_directory.run_ai.assert_called()

    def test_add_move_calls_ai_directory_move(self):
        move = "A1"
        self.game.add_move(move)
        self.mock_ai_directory.move.assert_called_with(move)

    def test_get_move_calls_ai_directory_play(self):
        self.game.get_move()
        self.mock_ai_directory.play.assert_called()

    def test_set_board_calls_ai_directory_board(self):
        board_position = "gabagool"
        self.game.set_board(board_position)
        self.mock_ai_directory.board.assert_called_with(board_position)

    def test_reset_board_calls_ai_directory_reset(self):
        self.game.reset_board()
        self.mock_ai_directory.reset.assert_called()

    def test_get_pid_calls_ai_directory_get_pid(self):
        self.game.get_pid()
        self.mock_ai_directory.get_pid.assert_called()

    def test_kill_calls_ai_directory_kill_process(self):
        self.game.kill()
        self.mock_ai_directory.kill_process.assert_called()

    def test_poll_calls_ai_directory_process_poll(self):
        self.game.poll()
        self.mock_ai_directory.process.poll.assert_called()
