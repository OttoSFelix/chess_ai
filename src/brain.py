from copy import deepcopy
from board import Board
import chess
import random

class Brain:
    def __init__(self):
        self.piece_values = {'p': 100, 'k': 320, 'b': 330, 'r': 500, 'q': 900, 'z': 20000}
        self.pawn_position = [
            [0,   0,   0,   0,   0,   0,   0,   0],
            [50,  50,  50,  50,  50,  50,  50,  50],
            [10,  10,  20,  30,  30,  20,  10,  10],
            [5,   5,  10,  25,  25,  10,   5,   5],
            [0,   0,   0,  20,  20,   0,   0,   0],
            [5,  -5, -10,   0,   0, -10,  -5,   5],
            [5,  10,  10, -20, -20,  10,  10,   5],
            [0,   0,   0,   0,   0,   0,   0,   0]
        ]
        self.knight_position = [
            [-50, -40, -30, -30, -30, -30, -40, -50],
            [-40, -20,   0,   0,   0,   0, -20, -40],
            [-30,   0,  10,  15,  15,  10,   0, -30],
            [-30,   5,  15,  20,  20,  15,   5, -30],
            [-30,   0,  15,  20,  20,  15,   0, -30],
            [-30,   5,  10,  15,  15,  10,   5, -30],
            [-40, -20,   0,   5,   5,   0, -20, -40],
            [-50, -40, -30, -30, -30, -30, -40, -50]
        ]
        self.bishop_position = [
            [-20, -10, -10, -10, -10, -10, -10, -20],
            [-10,   0,   0,   0,   0,   0,   0, -10],
            [-10,   0,   5,  10,  10,   5,   0, -10],
            [-10,   5,   5,  10,  10,   5,   5, -10],
            [-10,   0,  10,  10,  10,  10,   0, -10],
            [-10,  10,  10,  10,  10,  10,  10, -10],
            [-10,   5,   0,   0,   0,   0,   5, -10],
            [-20, -10, -10, -10, -10, -10, -10, -20]
        ]
        self.king_position = [
            [-30, -40, -40, -50, -50, -40, -40, -30],
            [-30, -40, -40, -50, -50, -40, -40, -30],
            [-30, -40, -40, -50, -50, -40, -40, -30],
            [-30, -40, -40, -50, -50, -40, -40, -30],
            [-20, -30, -30, -40, -40, -30, -30, -20],
            [-10, -20, -20, -20, -20, -20, -20, -10],
            [ 20,  20,   0,   0,   0,   0,  20,  20],
            [ 20,  30,  10,   0,   0,  10,  30,  20,]
        ]

        self.position_lookup = {
            'p': self.pawn_position,
            'k': self.knight_position,
            'b': self.bishop_position,
            'z': self.king_position,
        }
        self.positional_pieces = set(['p', 'k', 'b', 'z'])

        self.board = Board()
        self.board.init_board()
    
    def negamax_move(self, board, original_turn):
    
        all_move_values = []

        def traverse(board_state, turn, depth):

            if depth == 3:
                return self.get_state_value(board_state, turn) * turn

            self.board.board = deepcopy(board_state)

            possible_moves = self.board.legal_moves(turn)

            move_values = []
            for move in possible_moves:
                original_board = deepcopy(board_state)
                self.board.play_move(move)

                if self.board.is_king_checked(turn):
                    self.board.board = deepcopy(original_board)
                    continue

                check_bonus = 0
                if self.board.is_king_checked(-turn):
                    check_bonus += 200
                    
                next_eval = -traverse(self.board.board, -turn, depth+1) + check_bonus
                move_values.append((move, next_eval))
                self.board.board = deepcopy(original_board)

            return max(move_values, key=lambda x: x[1])[1]

        
        self.board.board = deepcopy(board)
        for move in self.board.legal_moves(original_turn):
            self.board.play_move(move)

            if self.board.is_king_checked(original_turn):
                    self.board.board = deepcopy(board)
                    continue

            check_bonus = 0
            if self.board.is_king_checked(-original_turn):
                    check_bonus += 200

            next_eval = -traverse(self.board.board, -original_turn, 1) + check_bonus
            all_move_values.append((move, next_eval))
            self.board.board = deepcopy(board)

        return max(all_move_values, key=lambda x: x[1])[0]


    def get_state_value(self, board_state, turn):


        white_total = 0
        black_total = 0

        for row in range(8):
            for col in range(8):
                piece = board_state[row][col]
                if piece == ' ':
                    continue

                if piece == piece.upper():
                    piece_value = self.piece_values[piece.lower()]
                    positional_value = 0
                    if piece.lower() in self.positional_pieces:
                        positional_value = self.position_lookup[piece.lower()][row][col]
                    white_total += piece_value + positional_value

                elif piece == piece.lower():
                    piece_value = self.piece_values[piece.lower()]
                    positional_value = 0
                    if piece.lower() in self.positional_pieces:
                        positional_value = self.position_lookup[piece.lower()][7-row][col]
                    black_total += piece_value + positional_value
        
        total_eval = white_total - black_total

        return total_eval * turn



if __name__ == '__main__':
    cboard = chess.Board()
    brain = Brain()
    board = Board()
    board.init_board()

    random.seed(40)
    for _ in range(30):
        possible_moves = [move.uci() for move in list(cboard.legal_moves)]
        move = random.choice(possible_moves)
        cboard.push_uci(move)
        board.play_move(move)
    
    print('Original:')
    for row in board.board:
        print(row)
    print()

    print(brain.negamax_move(board.board, 1))
