import os
import sys
import random
import pytest
import chess

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.board import Board


def get_chess_legal_moves(cboard: chess.Board) -> list[str]:
    """Returns sorted list of legal moves in UCI format from python-chess."""
    return sorted(move.uci() for move in cboard.legal_moves)


def get_custom_legal_moves(board: Board, cboard: chess.Board) -> list[str]:
    """Returns sorted list of legal moves in UCI format from custom Board."""
    turn = 1 if cboard.turn == chess.WHITE else 0
    return sorted(board.legal_moves(turn))


def test_initial_board_legal_moves():
    """Test legal moves on the starting board position."""
    cboard = chess.Board()
    board = Board()
    board.init_board()

    expected = get_chess_legal_moves(cboard)
    actual = get_custom_legal_moves(board, cboard)

    assert actual == expected


def test_legal_moves_after_one_random_move():
    """Test legal moves for Black after White plays 1 random move."""
    random.seed(42)
    cboard = chess.Board()
    board = Board()
    board.init_board()

    move = random.choice(list(cboard.legal_moves)).uci()
    cboard.push_uci(move)
    board.play_move(move)

    expected = get_chess_legal_moves(cboard)
    actual = get_custom_legal_moves(board, cboard)

    assert actual == expected


def test_legal_moves_after_two_random_moves():
    """Test legal moves after 2 random moves (White, then Black)."""
    random.seed(0)
    cboard = chess.Board()
    board = Board()
    board.init_board()

    for _ in range(2):
        move = random.choice(list(cboard.legal_moves)).uci()
        cboard.push_uci(move)
        board.play_move(move)

    expected = get_chess_legal_moves(cboard)
    actual = get_custom_legal_moves(board, cboard)

    assert actual == expected


def test_legal_moves_after_three_random_moves():
    """Test legal moves after 3 random moves."""
    random.seed(0)
    cboard = chess.Board()
    board = Board()
    board.init_board()

    for _ in range(3):
        move = random.choice(list(cboard.legal_moves)).uci()
        cboard.push_uci(move)
        board.play_move(move)

    expected = get_chess_legal_moves(cboard)
    actual = get_custom_legal_moves(board, cboard)

    assert actual == expected


@pytest.mark.parametrize("seed", [0, 3, 7, 8])
def test_random_sequence_step_by_step(seed):
    """Test that legal moves match at every step across a sequence of random moves."""
    random.seed(seed)
    cboard = chess.Board()
    board = Board()
    board.init_board()

    for step in range(3):
        expected = get_chess_legal_moves(cboard)
        actual = get_custom_legal_moves(board, cboard)
        assert actual == expected, f"Mismatch at step {step} with seed {seed}"

        move = random.choice(list(cboard.legal_moves)).uci()
        cboard.push_uci(move)
        board.play_move(move)
