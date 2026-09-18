from copy import deepcopy
from board import Board
import chess
import random

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

        self.check_bonus = 0

        self.last_moves_black = (None, None, None)
        self.last_moves_white = (None, None, None)

    def negamax_move(self, game_board: Board, original_turn):
        if original_turn == 1:
            print(f'Last 2 moves for white: {self.last_moves_white}')
        else:
            print(f'Last 2 moves for black: {self.last_moves_black}')

        self.board.white_can_castle_kingside = game_board.white_can_castle_kingside
        self.board.white_can_castle_queenside = game_board.white_can_castle_queenside
        self.board.black_can_castle_kingside = game_board.black_can_castle_kingside
        self.board.black_can_castle_queenside = game_board.black_can_castle_queenside
        self.board.board = [row[:] for row in game_board.board]

        self.max_depth = 0

        def traverse(turn, depth, alpha, beta, previous):

            self.max_depth = max(self.max_depth, depth)

            if depth >= 3:
                state_value = self.get_state_value(self.board.board, turn)
                if previous < 300 and (state_value > 2000 or state_value < 2000):
                    return state_value

            if depth >= 5:
                state_value = self.get_state_value(self.board.board, turn)
                if state_value > 2000 or state_value < 2000:
                    return state_value
                else:
                    print(f'Depth exceeded 5 with depth {depth}')

            if depth >= 10:
                return self.get_state_value


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

                horizon_eval = self.get_state_value(self.board.board, turn)

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

                check_bonus = 0
                if self.board.is_king_checked(-turn):
                    check_bonus += self.check_bonus

                horizon_eval = self.get_state_value(self.board.board, turn) - horizon_eval

                next_eval = -traverse(-turn, depth+1, -beta, -alpha, horizon_eval) + check_bonus
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
                    return -20000 + (depth * 10)
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
            if original_turn == 1 and self.last_moves_white[-2] == move and self.last_moves_white[-3] == self.last_moves_white[-1]:
                continue
            if original_turn == -1 and self.last_moves_black[-2] == move and self.last_moves_black[-3] == self.last_moves_black[-1]:
                continue

            horizon_eval = self.get_state_value(self.board.board, original_turn)

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
            
            check_bonus = 0
            if self.board.is_king_checked(-original_turn):
                check_bonus += self.check_bonus

            horizon_eval = self.get_state_value(self.board.board, original_turn) - horizon_eval

            next_eval = -traverse(-original_turn, 1, -beta, -alpha, horizon_eval) + check_bonus

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



if __name__ == '__main__':
    cboard = chess.Board()
    board = Board()
    brain = Brain(board)
    board.init_board()

    # random.seed(40)
    # for _ in range(30):
    #     possible_moves = [move.uci() for move in list(cboard.legal_moves)]
    #     move = random.choice(possible_moves)
    #     cboard.push_uci(move)
    #     board.play_move(move)

    turn = board.push_fen("1r4k1/rpp1qppp/p1nbpn2/3p2Nb/3P4/P1NBPP1P/RPPB2P1/3Q1RK1 w - - 23 25")

    legal_moves = board.legal_moves(1)
    original_board = [row[:] for row in board.board]
    evaluations = []
    for move in legal_moves:
        board.play_move(move)
        eval = brain.get_state_value(board.board, 1)
        evaluations.append((move, eval))
        board.board = [row[:] for row in original_board]
    
    evaluations.sort(key=lambda x: x[1])

    print(evaluations)

    # print(brain.negamax_move(board, 1))
