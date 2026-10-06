import sys
from board import Board
from brain import Brain

def main():
    board = Board()
    board.init_board()
    brain = Brain(board)
    turn = 1

    while True:
        line = sys.stdin.readline()
        if not line:
            break

        tokens = line.strip().split()
        if not tokens:
            continue

        cmd = tokens[0]

        if cmd == "uci":
            print("id name OdoChess_bot")
            print("id author You")
            print("uciok", flush=True)

        elif cmd == "isready":
            print("readyok", flush=True)

        elif cmd == "ucinewgame":
            board.init_board()
            turn = 1

        elif cmd == "position":
            if "startpos" in tokens:
                board.init_board()
                turn = 1
                if "moves" in tokens:
                    move_idx = tokens.index("moves") + 1
                    for m in tokens[move_idx:]:
                        board.play_move(m)
                        turn = -turn

        elif cmd == "go":
            best_move = brain.negamax_move(board, turn)
                
            print(f"bestmove {best_move}", flush=True)
            turn = -turn

        elif cmd == "quit":
            break

if __name__ == "__main__":
    main()