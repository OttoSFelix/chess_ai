import random
import time
from board import Board
import chess
from brain import Brain

def set_board(board: Board, board_position:str):
    print(f"Set board to {board_position}!", flush=True)
    board.set_fen(board_position)

def make_move(board: Board):
    legal_moves = [move.uci() for move in list(board.legal_moves)]
    print(f"I found {len(legal_moves)} legal moves: {', '.join(legal_moves)}", flush=True)
    choice = random.choice(legal_moves)
    return choice

def debug_legal_moves(board: Board, debug_board: chess.Board, turn):
    debug_board.set_castling_fen("-")
    expected_moves = [move.uci() for move in list(debug_board.pseudo_legal_moves)]

    predicted_moves = [move for move in board.legal_moves(turn)]

    if expected_moves == predicted_moves:
        return True

    return False



def main():

    cboard = chess.Board()

    board = Board()
    board.init_board()
    turn = 1

    brain = Brain()

    while True:

        opponent_move = input()
        if opponent_move.startswith("BOARD:"):
            board.init_board()
            turn = 1
        elif opponent_move.startswith("RESET:"):
            cboard.reset()
            board.init_board()
            turn = 1
            print("Board reset!", flush=True)
        elif opponent_move.startswith("PLAY:"):
            if cboard.turn == chess.WHITE:
                print('Playing random move!!!', flush=True)
                choice = make_move(cboard)
            else:
                print('Playing AI move!!!', flush=True)
                choice = brain.negamax_move(board.board, turn)

            cboard.push_uci(choice)
            board.play_move(choice)
            print(f"I chose {choice}!", flush=True)

            print(f"MOVE:{choice}", flush=True)
            turn = -turn
        elif opponent_move.startswith("MOVE:"):
            move = opponent_move.removeprefix("MOVE:")
            board.play_move(move)
            turn = -turn

            cboard.push_uci(move)
            print(f"Received move: {move}", flush=True)
        else:
            print(f"Unknown tag: {opponent_move}", flush=True)
            break

if __name__ == "__main__":
    main()
