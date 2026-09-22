import pytest
import os
import sys
import chess
import random

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.board import Board


def get_chess_legal_moves(cboard: chess.Board) -> list[str]:
    """Returns sorted list of legal moves in UCI format from python-chess."""
    return [move.uci() for move in cboard.legal_moves]

def get_chess_pseudo_legal_moves(cboard: chess.Board) -> list[str]:
    """Returns sorted list of legal moves in UCI format from python-chess."""
    return sorted(move.uci() for move in cboard.pseudo_legal_moves)

def get_custom_legal_moves(board: Board, cboard: chess.Board) -> list[str]:
    """Returns sorted list of legal moves in UCI format from custom Board."""
    turn = 1 if cboard.turn == chess.WHITE else -1
    return sorted(board.legal_moves(turn))


def test_king_check_after_20_moves():
    """Tests if the king is in check after 20 random moves"""
    random.seed(30)
    cboard = chess.Board()
    board = Board()
    board.init_board()

    for _ in range(20):
        moves = get_chess_legal_moves(cboard)
        move = random.choice(moves)
        cboard.push_uci(move)
        board.play_move(move)

    cboard.push_uci('b6d8')
    board.play_move('b6d8')

    expected = cboard.is_check()
    assert expected == True
    actual = board.is_king_checked(-1)

    assert actual == expected

def test_king_check_after_30_moves():
    """Tests if the king is in check after 30 random moves"""
    random.seed(37)
    cboard = chess.Board()
    board = Board()
    board.init_board()

    for _ in range(30):
        moves = get_chess_legal_moves(cboard)
        move = random.choice(moves)
        cboard.push_uci(move)
        board.play_move(move)
    
    cboard.push_uci('b5d6')
    board.play_move('b5d6')

    expected = cboard.is_check()
    assert expected == True
    actual = board.is_king_checked(-1)

    assert actual == expected

def test_king_check_after_40_moves():
    """Tests if the king is in check after 40 random moves"""
    random.seed(20)
    cboard = chess.Board()
    board = Board()
    board.init_board()

    for _ in range(40):
        moves = get_chess_legal_moves(cboard)
        move = random.choice(moves)
        cboard.push_uci(move)
        board.play_move(move)

    expected = cboard.is_check()
    assert expected == True
    actual = board.is_king_checked(1)

    assert actual == expected

def test_king_not_in_check():
    """Tests if the king is in check when not supposed to be"""
    random.seed(20)
    cboard = chess.Board()
    board = Board()
    board.init_board()

    for _ in range(20):
        moves = get_chess_legal_moves(cboard)
        move = random.choice(moves)
        cboard.push_uci(move)
        board.play_move(move)

    expected = cboard.is_check()
    assert expected == False
    actual = board.is_king_checked(1)

    assert actual == expected

def test_king_check_after_50_moves():
    """Tests if the king is in check after 50 random moves"""
    random.seed(38)
    cboard = chess.Board()
    board = Board()
    board.init_board()

    for _ in range(50):
        moves = get_chess_legal_moves(cboard)
        move = random.choice(moves)
        cboard.push_uci(move)
        board.play_move(move)

    cboard.push_uci('f3c6')
    board.play_move('f3c6')

    expected = cboard.is_check()
    assert expected == True
    actual = board.is_king_checked(-1)

    assert actual == expected