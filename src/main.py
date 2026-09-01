import random
import time
from board import Board

def set_board(board: Board, board_position:str):
    print(f"Set board to {board_position}!", flush=True)
    board.set_fen(board_position)

def make_move(board: Board):
    legal_moves = [move.uci() for move in list(board.legal_moves)]
    print(f"I found {len(legal_moves)} legal moves: {', '.join(legal_moves)}", flush=True)
    choice = random.choice(legal_moves)
    board.push_uci(choice)

    return choice

def main():

    

    while True:
        opponent_move = input()
        time.sleep(random.randrange(1,10)/100)
        if opponent_move.startswith("BOARD:"):
            pass
        elif opponent_move.startswith("RESET:"):
            pass
            print("Board reset!", flush=True)
        elif opponent_move.startswith("PLAY:"):
            pass
            # example about logs
            print(f"I chose __!", flush=True)
            # example about posting a move
            print(f"MOVE:__", flush=True)
        elif opponent_move.startswith("MOVE:"):
            pass
            move = opponent_move.removeprefix("MOVE:")
            print(f"Received move: {move}", flush=True)
        else:
            print(f"Unknown tag: {opponent_move}", flush=True)
            break

if __name__ == "__main__":
    main()
