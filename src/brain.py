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
        self.endgame_pawn_position = [
            [0,   0,   0,   0,   0,   0,   0,   0],
            [50,  50,  50,  50,  50,  50,  50,  50],
            [40,  40,  40,  40,  40,  40,  40,  40],
            [30,  30,  30,  30,  30,  30,   30,  30],
            [20,  20,  20,  20,  20,  20,   20,  20],
            [10,  10,  10,  10,  10,  10,   10,  10],
            [0,   0,   0,   0,   0,   0,   0,   0],
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
        self.starting_state = False
        self.endgame_state = False
        if self.actual_board == [
            ['r', 'k', 'b', 'q', 'z', 'b', 'k', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'K', 'B', 'Q', 'Z', 'B', 'K', 'R'],]:

            self.starting_state = True


        self.check_penalty = 5
        self.check_cover_bonus = 20

        self.last_moves = {1: (None, None, None), -1: (None, None, None)}

    def negamax_move(self, game_board: Board, original_turn):

        self.board.white_can_castle_kingside = game_board.white_can_castle_kingside
        self.board.white_can_castle_queenside = game_board.white_can_castle_queenside
        self.board.black_can_castle_kingside = game_board.black_can_castle_kingside
        self.board.black_can_castle_queenside = game_board.black_can_castle_queenside
        self.board.board = [row[:] for row in game_board.board]

        self.max_depth = 0

        self.endgame_state = False
        if self.get_overall_material(game_board.board) <= 41600:
            self.endgame_state = True
            self.pawn_position = [row[:] for row in self.endgame_pawn_position]
            self.king_position = [[0] * 8] * 8
            self.position_lookup['p'] = self.pawn_position                                                                                                                        
            self.position_lookup['z'] = self.king_position  

        original_state_value = self.get_state_value(self.board.board, original_turn)

        def traverse(turn, depth, alpha, beta):

            self.max_depth = max(self.max_depth, depth)

            royal_distance = self.board.royal_distance(turn)
            if depth >= 4:
                if not self.endgame_state and original_state_value < 2500 and original_state_value > -2500 and royal_distance > 2:
                    return self.horizon_search(alpha, beta, turn, depth)

            if depth >= 6:
                return self.horizon_search(alpha, beta, turn, depth)

            original_board = [row[:] for row in self.board.board]
            castling_state = (
                    self.board.white_can_castle_kingside,
                    self.board.white_can_castle_queenside,
                    self.board.black_can_castle_kingside,
                    self.board.black_can_castle_queenside,
                )

            depth_increment = 0 if self.board.is_king_checked(turn) else 1

            possible_moves = sorted(self.board.legal_moves(turn), key=self.sort_moves_key, reverse=True)
            legal_move_count = 0

            max_eval = float('-inf')
            for move in possible_moves:

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

                next_eval = -traverse(-turn, depth+depth_increment, -beta, -alpha)
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

        possible_moves = sorted(self.board.legal_moves(original_turn), key=self.sort_moves_key, reverse=True)
        for move in possible_moves:

            if self.starting_state:
                pawn_row = '2' if original_turn == 1 else '7'
                if move[1] != pawn_row:
                    if random.random() > 0.5:
                        continue
            elif move == self.last_moves[original_turn][1] and self.last_moves[original_turn][0] == self.last_moves[original_turn][2]:
                continue

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

            next_eval = -traverse(-original_turn, 1, -beta, -alpha)

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
        self.last_moves[original_turn] = (self.last_moves[original_turn][1], self.last_moves[original_turn][2], best_move)
        return best_move

    def horizon_search(self, alpha, beta, turn, depth):
        self.max_depth = max(self.max_depth, depth)

        check_penalty = 0
        if self.board.is_king_checked(turn):
            check_penalty += self.check_penalty
            check_penalty += self.check_covering_bonus(self.board.board, -turn)

            capture_moves = self.board.legal_moves(turn)

        else:
            capture_moves = []
            for move in self.board.legal_moves(turn):
                row, col = self.board.tile_lookup.get(move[2:4])
                if self.board.board[row][col] != ' ':
                    capture_moves.append(move)
            capture_moves.sort(key=self.sort_moves_key, reverse=True)

        initial = self.get_state_value(self.board.board, turn) - check_penalty
        if initial >= beta:
            return beta
        if initial > alpha:
            alpha = initial

        max_eval = initial

        original_board = [row[:] for row in self.board.board]
        castling_state = (
            self.board.black_can_castle_kingside,
            self.board.black_can_castle_queenside,
            self.board.white_can_castle_kingside,
            self.board.white_can_castle_queenside
        )

        for move in capture_moves:
            self.board.play_move(move)

            if self.board.is_king_checked(turn):
                self.board.board = [row[:] for row in original_board]
                (
                self.board.black_can_castle_kingside,
                self.board.black_can_castle_queenside,
                self.board.white_can_castle_kingside,
                self.board.white_can_castle_queenside
                ) = castling_state
                continue

            next_eval = -self.horizon_search(-beta, -alpha, -turn, depth+1)

            self.board.board = [row[:] for row in original_board]
            (
            self.board.black_can_castle_kingside,
            self.board.black_can_castle_queenside,
            self.board.white_can_castle_kingside,
            self.board.white_can_castle_queenside
            ) = castling_state


            if next_eval > max_eval:
                max_eval = next_eval
            if max_eval > alpha:
                alpha = max_eval
            if alpha >= beta:
                break

        return max_eval




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

    def get_overall_material(self, board_state):
        total_material = 0

        for row in range(8):
            for col in range(8):
                piece = board_state[row][col]
                if piece == ' ':
                    continue

                piece_value = self.piece_values[piece.lower()]
                total_material += piece_value

        return total_material

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

    def sort_moves_key(self, move):
        if len(move) == 5:
            promoted = 'k' if move[4] == 'n' else move[4]
            return self.piece_values.get(promoted, 0)
        target_tile = self.board.tile_lookup[move[2:4]]
        row, col = target_tile
        return self.piece_values.get(self.board.board[row][col].lower(), 0)

if __name__ == '__main__':
    cboard = chess.Board()
    board = Board()
    brain = Brain(board)
    board.init_board()


    board.push_fen("8/8/8/8/1p3k2/1Pb5/6PK/1B6 b - - 0 0")

    # print(brain.get_state_value(board.board, -1))
    # print(brain.check_covering_bonus(board.board, -1))

    for row in board.board:
        print(row)

    start = time()
    print(brain.negamax_move(board, -1))
    # print(brain.get_state_value(board.board, -1))
    end = time()

    total = end - start
    print(f'total time taken: {total:2f}')
