from copy import deepcopy
from board import Board
import chess
import random
from time import time

class Brain:
    def __init__(self, game_board: Board):
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

        self.actual_board = game_board

        self.check_penalty = 0
        self.check_cover_bonus = 20

        self.last_moves_black = (None, None, None)
        self.last_moves_white = (None, None, None)

    def negamax_move(self, game_board: Board, original_turn):

        self.board.white_can_castle_kingside = game_board.white_can_castle_kingside
        self.board.white_can_castle_queenside = game_board.white_can_castle_queenside
        self.board.black_can_castle_kingside = game_board.black_can_castle_kingside
        self.board.black_can_castle_queenside = game_board.black_can_castle_queenside
        self.board.board = [row[:] for row in game_board.board]

        self.max_depth = 0

        original_state_value = self.get_state_value(self.board.board, original_turn)

        def traverse(turn, depth, alpha, beta, previous_val, previous_move):

            self.max_depth = max(self.max_depth, depth)

            check_penalty = 0
            if self.board.is_king_checked(turn):
                check_penalty += self.check_penalty
                check_penalty += self.check_covering_bonus(self.board.board, -turn)

            move_pruning = False

            state_value = self.get_state_value(self.board.board, turn)

            if depth >= 4:
                if previous_val < 300 and original_state_value < 2500 and original_state_value > -2500:
                    return state_value - check_penalty


            if depth >= 5:
                if previous_val < 300 and original_state_value < 2500 and original_state_value > -2500:
                    return state_value - check_penalty

            if depth >= 6:
                if previous_val < 300:
                    return state_value - check_penalty
                move_pruning = True

            if depth >= 8:
                return state_value - check_penalty

            if not previous_move:
                move_pruning = False
            else:
                previous_capture = previous_move[2:4]


            original_board = [row[:] for row in self.board.board]
            castling_state = (
                    self.board.white_can_castle_kingside,
                    self.board.white_can_castle_queenside,
                    self.board.black_can_castle_kingside,
                    self.board.black_can_castle_queenside,
                )

            possible_moves = self.board.legal_moves(turn)
            legal_move_count = 0

            max_eval = float('-inf')
            for move in possible_moves:
                if move_pruning:
                    if move[2:4] != previous_capture:
                        continue

                self.board.play_move(move)

                if self.board.is_king_checked(turn):
                    self.board.board = [row[:] for row in original_board]
                    (
                        self.board.white_can_castle_kingside,
                        self.board.white_can_castle_queenside,
                        self.board.black_can_castle_kingside,
                        self.board.black_can_castle_queenside,
                    ) = castling_state
                    continue
                legal_move_count += 1

                horizon_eval = self.get_state_value(self.board.board, turn)

                next_eval = -traverse(-turn, depth+1, -beta, -alpha, horizon_eval - state_value, move)
                self.board.board = [row[:] for row in original_board]
                (
                    self.board.white_can_castle_kingside,
                    self.board.white_can_castle_queenside,
                    self.board.black_can_castle_kingside,
                    self.board.black_can_castle_queenside,
                ) = castling_state

                if next_eval > max_eval:
                    max_eval = next_eval

                if max_eval > alpha:
                    alpha = max_eval

                if alpha >= beta:
                    break

            if legal_move_count == 0:
                if self.board.is_king_checked(turn):
                    return -50000 + (depth * 1000)
                if move_pruning:
                    return traverse(turn, depth, alpha, beta, previous_val, None)
                    print('Double same traverse!!')
                return 0
            return max_eval


        alpha = float('-inf')
        beta = float('inf')

        best_move = None
        castling_state = (
                self.board.white_can_castle_kingside,
                self.board.white_can_castle_queenside,
                self.board.black_can_castle_kingside,
                self.board.black_can_castle_queenside,
            )

        for move in self.board.legal_moves(original_turn):

            self.board.play_move(move)

            if self.board.is_king_checked(original_turn):
                    self.board.board = [row[:] for row in game_board.board]
                    (
                        self.board.white_can_castle_kingside,
                        self.board.white_can_castle_queenside,
                        self.board.black_can_castle_kingside,
                        self.board.black_can_castle_queenside,
                    ) = castling_state
                    continue

            horizon_eval = self.get_state_value(self.board.board, original_turn)

            next_eval = -traverse(-original_turn, 1, -beta, -alpha, horizon_eval - original_state_value, None)

            if next_eval > alpha:
                alpha = next_eval
                best_move = move
            self.board.board = [row[:] for row in game_board.board]
            (
                self.board.white_can_castle_kingside,
                self.board.white_can_castle_queenside,
                self.board.black_can_castle_kingside,
                self.board.black_can_castle_queenside,
            ) = castling_state
        print(f'maximum depth reached = {self.max_depth}')

        print(f'alpha: {alpha}')
        if original_turn == 1:
            self.last_moves_white = (self.last_moves_white[1], self.last_moves_white[2], best_move)
        else:
            self.last_moves_black = (self.last_moves_black[1], self.last_moves_black[2], best_move)
        return best_move


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

    def check_covering_bonus(self, board_state, turn):
        original_board = [row[:] for row in self.board.board]
        self.board.board = board_state
        total_bonus = 0

        covered_positions = []
        covering_funcs = [
            self.board.knight_cover,
            self.board.pawn_cover,
            self.board.cross_cover,
            self.board.straight_cover,
            self.board.king_cover
        ]

        king_row, king_col = self.board.get_king_id(-turn)
        for func in covering_funcs:
            covered_positions += func((king_row, king_col), -turn)

        for pos in covered_positions:
            if self.board.is_position_covered(pos, -turn):
                total_bonus += self.check_cover_bonus

        self.board.board = [row[:] for row in original_board]
        return total_bonus



if __name__ == '__main__':
    cboard = chess.Board()
    board = Board()
    brain = Brain(board)
    board.init_board()

    
    board.push_fen("r1b3rk/ppp2p1p/3p3K/8/8/3q4/8/8 b - - 3 47")

    print(brain.get_state_value(board.board, -1))
    print(brain.check_covering_bonus(board.board, -1))

    for row in board.board:
        print(row)

    start = time()
    print(brain.negamax_move(board, -1))
    end = time()

    total = end - start
    print(f'total time taken: {total:2f}')

