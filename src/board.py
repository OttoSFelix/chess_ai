
class Board:
    def __init__(self):
        self.tile_lookup = {
            'a1': (7, 0), 'b1': (7, 1), 'c1': (7, 2), 'd1': (7, 3),
            'e1': (7, 4), 'f1': (7, 5), 'g1': (7, 6), 'h1': (7, 7),
            'a2': (6, 0), 'b2': (6, 1), 'c2': (6, 2), 'd2': (6, 3),
            'e2': (6, 4), 'f2': (6, 5), 'g2': (6, 6), 'h2': (6, 7),
            'a3': (5, 0), 'b3': (5, 1), 'c3': (5, 2), 'd3': (5, 3),
            'e3': (5, 4), 'f3': (5, 5), 'g3': (5, 6), 'h3': (5, 7),
            'a4': (4, 0), 'b4': (4, 1), 'c4': (4, 2), 'd4': (4, 3),
            'e4': (4, 4), 'f4': (4, 5), 'g4': (4, 6), 'h4': (4, 7),
            'a5': (3, 0), 'b5': (3, 1), 'c5': (3, 2), 'd5': (3, 3),
            'e5': (3, 4), 'f5': (3, 5), 'g5': (3, 6), 'h5': (3, 7),
            'a6': (2, 0), 'b6': (2, 1), 'c6': (2, 2), 'd6': (2, 3),
            'e6': (2, 4), 'f6': (2, 5), 'g6': (2, 6), 'h6': (2, 7),
            'a7': (1, 0), 'b7': (1, 1), 'c7': (1, 2), 'd7': (1, 3),
            'e7': (1, 4), 'f7': (1, 5), 'g7': (1, 6), 'h7': (1, 7),
            'a8': (0, 0), 'b8': (0, 1), 'c8': (0, 2), 'd8': (0, 3),
            'e8': (0, 4), 'f8': (0, 5), 'g8': (0, 6), 'h8': (0, 7),
        }
        self.board = []

    def init_board(self):
        self.board = [
            ['r', 'k', 'b', 'q', 'z', 'b', 'k', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'K', 'B', 'Q', 'Z', 'B', 'K', 'R'],
        ]

    def pawn_moves(self, tile):
        row = tile[0]
        col = tile[1]

        character: str = self.board[row][col]
        possible_moves = set()

        if character.lower() != 'p':
            return Exception (f'Error: pawn not in {tile}')

        if character == character.lower():
            if self.board[row+1][col] == ' ':
                possible_moves.add((row+1, col))
            if col >= 1 and col <= 6:
                if self.board[row+1][col+1] != ' ':
                    if self.board[row+1][col+1] == self.board[row+1][col+1].upper():
                        possible_moves.add((row+1, col+1))
                if self.board[row+1][col-1] != ' ':
                    if self.board[row+1][col-1] == self.board[row+1][col-1].upper():
                        possible_moves.add((row+1, col-1))
                return list(possible_moves)
            if col == 0:
                if self.board[row+1][col+1] != ' ':
                    if self.board[row+1][col+1] == self.board[row+1][col+1].upper():
                        possible_moves.add((row+1, col+1))
                return list(possible_moves)
            if col == 7:
                if self.board[row+1][col-1] != ' ':
                    if self.board[row+1][col-1] == self.board[row+1][col-1].upper():
                        possible_moves.add((row+1, col-1))
                return list(possible_moves)
        else:
            if self.board[row-1][col] == ' ':
                possible_moves.add((row-1, col))
            if col >= 1 and col <= 6:
                if self.board[row-1][col+1] != ' ':
                    if self.board[row-1][col+1] == self.board[row-1][col+1].lower():
                        possible_moves.add((row-1, col+1))
                if self.board[row-1][col-1] != ' ':
                    if self.board[row-1][col-1] == self.board[row-1][col-1].lower():
                        possible_moves.add((row-1, col-1))
                return list(possible_moves)
            if col == 0:
                if self.board[row-1][col+1] != ' ':
                    if self.board[row-1][col+1] == self.board[row-1][col+1].lower():
                        possible_moves.add((row-1, col+1))
                return list(possible_moves)
            if col == 7:
                if self.board[row-1][col-1] != ' ':
                    if self.board[row-1][col-1] == self.board[row-1][col-1].lower():
                        possible_moves.add((row-1, col-1))

                return list(possible_moves)

    def knight_moves(self, tile):
        row = tile[0]
        col = tile[1]

        character = self.board[row][col]
        possible_moves_copy = [(row+2, col+1), (row+1, col+2), (row-1, col+2), (row-2, col+1), (row-2, col-1), (row-1, col-2), (row+1, col-2), (row+2, col-1)]
        possible_moves = set(possible_moves_copy)

        if character.lower() != 'k':
            return Exception (f'Error: knight not in {tile}')

        if character == character.lower():
            for row, col in possible_moves_copy:
                if row > 7 or row < 0 or col > 7 or col < 0:
                    possible_moves.remove((row, col))
                    continue
                if self.board[row][col] != ' ':
                    if self.board[row][col] == self.board[row][col].lower():
                        possible_moves.remove((row, col))
        else:
            for row, col in possible_moves_copy:
                if row > 7 or row < 0 or col > 7 or col < 0:
                    possible_moves.remove((row, col))
                    continue
                if self.board[row][col] != ' ':
                    if self.board[row][col] == self.board[row][col].upper():
                        possible_moves.remove((row, col))

        return list(possible_moves)

    def rook_moves(self, tile, queen: bool = False):
        row = tile[0]
        col = tile[1]

        possible_moves = set()
        character = self.board[row][col]
        
        if not queen:
            if character.lower() != 'r':
                return Exception (f'Error: rook not in {tile}')

        temp_row = row
        temp_col = col

        if character == character.lower():
            while True:
                temp_row += 1
                if temp_row > 7:
                    temp_row = row
                    break
                if self.board[temp_row][col] == ' ':
                    possible_moves.add((temp_row, col))
                    continue
                if self.board[temp_row][col] == self.board[temp_row][col].upper():
                    possible_moves.add((temp_row, col))
                    temp_row = row
                    break
                else:
                    temp_row = row
                    break
            
            while True:
                temp_row -= 1
                if temp_row < 0:
                    temp_row = row
                    break
                if self.board[temp_row][col] == ' ':
                    possible_moves.add((temp_row, col))
                    continue
                if self.board[temp_row][col] == self.board[temp_row][col].upper():
                    possible_moves.add((temp_row, col))
                    temp_row = row
                    break
                else:
                    temp_row = row
                    break

            while True:
                temp_col += 1
                if temp_col > 7:
                    temp_col = col
                    break
                if self.board[row][temp_col] == ' ':
                    possible_moves.add((row, temp_col))
                    continue
                if self.board[row][temp_col] == self.board[row][temp_col].upper():
                    possible_moves.add((row, temp_col))
                    temp_col = col
                    break
                else:
                    temp_col = col
                    break

            while True:
                temp_col -= 1
                if temp_col < 0:
                    temp_col = col
                    break
                if self.board[row][temp_col] == ' ':
                    possible_moves.add((row, temp_col))
                    continue
                if self.board[row][temp_col] == self.board[row][temp_col].upper():
                    possible_moves.add((row, temp_col))
                    temp_col = col
                    break
                else:
                    temp_col = col
                    break  

        else:
            while True:
                temp_row += 1
                if temp_row > 7:
                    temp_row = row
                    break
                if self.board[temp_row][col] == ' ':
                    possible_moves.add((temp_row, col))
                    continue
                if self.board[temp_row][col] == self.board[temp_row][col].lower():
                    possible_moves.add((temp_row, col))
                    temp_row = row
                    break
                else:
                    temp_row = row
                    break
            
            while True:
                temp_row -= 1
                if temp_row < 0:
                    temp_row = row
                    break
                if self.board[temp_row][col] == ' ':
                    possible_moves.add((temp_row, col))
                    continue
                if self.board[temp_row][col] == self.board[temp_row][col].lower():
                    possible_moves.add((temp_row, col))
                    temp_row = row
                    break
                else:
                    temp_row = row
                    break

            while True:
                temp_col += 1
                if temp_col > 7:
                    temp_col = col
                    break
                if self.board[row][temp_col] == ' ':
                    possible_moves.add((row, temp_col))
                    continue
                if self.board[row][temp_col] == self.board[row][temp_col].lower():
                    possible_moves.add((row, temp_col))
                    temp_col = col
                    break
                else:
                    temp_col = col
                    break

            while True:
                temp_col -= 1
                if temp_col < 0:
                    temp_col = col
                    break
                if self.board[row][temp_col] == ' ':
                    possible_moves.add((row, temp_col))
                    continue
                if self.board[row][temp_col] == self.board[row][temp_col].lower():
                    possible_moves.add((row, temp_col))
                    temp_col = col
                    break
                else:
                    temp_col = col
                    break  

        return list(possible_moves)

    def bishop_moves(self, tile, queen: bool = False):
        row = tile[0]
        col = tile[1]

        possible_moves = set()
        character = self.board[row][col]
        
        if not queen:
            if character.lower() != 'b':
                return Exception (f'Error: bishop not in {tile}')

        temp_row = row
        temp_col = col
        
        if character == character.lower():
            while True:
                temp_row += 1
                temp_col += 1
                if temp_row > 7 or temp_col > 7:
                    temp_row = row
                    temp_col = col
                    break
                if self.board[temp_row][temp_col] == ' ':
                    possible_moves.add((temp_row, temp_col))
                    continue
                if self.board[temp_row][temp_col] == self.board[temp_row][temp_col].upper():
                    possible_moves.add((temp_row, temp_col))
                    temp_row = row
                    temp_col = col
                    break
                else:
                    temp_row = row
                    temp_col = col
                    break

            while True:
                temp_row -= 1
                temp_col += 1
                if temp_row < 0 or temp_col > 7:
                    temp_row = row
                    temp_col = col
                    break
                if self.board[temp_row][temp_col] == ' ':
                    possible_moves.add((temp_row, temp_col))
                    continue
                if self.board[temp_row][temp_col] == self.board[temp_row][temp_col].upper():
                    possible_moves.add((temp_row, temp_col))
                    temp_row = row
                    temp_col = col
                    break
                else:
                    temp_row = row
                    temp_col = col
                    break
            
            while True:
                temp_row += 1
                temp_col -= 1
                if temp_row > 7 or temp_col < 0:
                    temp_row = row
                    temp_col = col
                    break
                if self.board[temp_row][temp_col] == ' ':
                    possible_moves.add((temp_row, temp_col))
                    continue
                if self.board[temp_row][temp_col] == self.board[temp_row][temp_col].upper():
                    possible_moves.add((temp_row, temp_col))
                    temp_row = row
                    temp_col = col
                    break
                else:
                    temp_row = row
                    temp_col = col
                    break

            while True:
                temp_row -= 1
                temp_col -= 1
                if temp_row < 0 or temp_col < 0:
                    temp_row = row
                    temp_col = col
                    break
                if self.board[temp_row][temp_col] == ' ':
                    possible_moves.add((temp_row, temp_col))
                    continue
                if self.board[temp_row][temp_col] == self.board[temp_row][temp_col].upper():
                    possible_moves.add((temp_row, temp_col))
                    temp_row = row
                    temp_col = col
                    break
                else:
                    temp_row = row
                    temp_col = col
                    break

        else:
            while True:
                temp_row += 1
                temp_col += 1
                if temp_row > 7 or temp_col > 7:
                    temp_row = row
                    temp_col = col
                    break
                if self.board[temp_row][temp_col] == ' ':
                    possible_moves.add((temp_row, temp_col))
                    continue
                if self.board[temp_row][temp_col] == self.board[temp_row][temp_col].lower():
                    possible_moves.add((temp_row, temp_col))
                    temp_row = row
                    temp_col = col
                    break
                else:
                    temp_row = row
                    temp_col = col
                    break

            while True:
                temp_row -= 1
                temp_col += 1
                if temp_row < 0 or temp_col > 7:
                    temp_row = row
                    temp_col = col
                    break
                if self.board[temp_row][temp_col] == ' ':
                    possible_moves.add((temp_row, temp_col))
                    continue
                if self.board[temp_row][temp_col] == self.board[temp_row][temp_col].lower():
                    possible_moves.add((temp_row, temp_col))
                    temp_row = row
                    temp_col = col
                    break
                else:
                    temp_row = row
                    temp_col = col
                    break
            
            while True:
                temp_row += 1
                temp_col -= 1
                if temp_row > 7 or temp_col < 0:
                    temp_row = row
                    temp_col = col
                    break
                if self.board[temp_row][temp_col] == ' ':
                    possible_moves.add((temp_row, temp_col))
                    continue
                if self.board[temp_row][temp_col] == self.board[temp_row][temp_col].lower():
                    possible_moves.add((temp_row, temp_col))
                    temp_row = row
                    temp_col = col
                    break
                else:
                    temp_row = row
                    temp_col = col
                    break

            while True:
                temp_row -= 1
                temp_col -= 1
                if temp_row < 0 or temp_col < 0:
                    temp_row = row
                    temp_col = col
                    break
                if self.board[temp_row][temp_col] == ' ':
                    possible_moves.add((temp_row, temp_col))
                    continue
                if self.board[temp_row][temp_col] == self.board[temp_row][temp_col].lower():
                    possible_moves.add((temp_row, temp_col))
                    temp_row = row
                    temp_col = col
                    break
                else:
                    temp_row = row
                    temp_col = col
                    break

        return list(possible_moves)

    def queen_moves(self, tile):
        if self.board[tile[0]][tile[1]].lower() != 'q':
            return Exception (f'Error: queen not in {tile}')

        return self.rook_moves(tile, True) + self.bishop_moves(tile, True)

    def king_moves(self, tile):
        row = tile[0]
        col = tile[1]

        possible_moves_copy = [(row+1, col), (row+1, col+1), (row, col+1), (row-1, col+1), (row-1, col), (row-1, col-1), (row, col-1), (row+1, col-1)]
        possible_moves = set(possible_moves_copy)
        character = self.board[row][col]

        if character.lower() != 'z':
            return Exception (f'Error: king not in {tile}')

        if character == character.lower():
            for row, col in possible_moves_copy:
                if row > 7 or row < 0 or col > 7 or col < 0:
                    possible_moves.remove((row, col))
                    continue
                if self.board[row][col] != ' ':
                    if self.board[row][col] == self.board[row][col].lower():
                        possible_moves.remove((row, col))
        
        else:
            for row, col in possible_moves_copy:
                if row > 7 or row < 0 or col > 7 or col < 0:
                    possible_moves.remove((row, col))
                    continue
                if self.board[row][col] != ' ':
                    if self.board[row][col] == self.board[row][col].upper():
                        possible_moves.remove((row, col))

        return list(possible_moves)

    def legal_moves(self):
        pass

    def get_king_id(self):
        for row in range(8):
            for col in range(8):
                if self.board[row][col] == 'z':
                    return row, col

    def king_safe_tiles(self):
        king_id = self.get_king_id()
        row, col = king_id
        safe_tiles = set([(row-1, col-1), (row-1, col), (row-1, col+1), (row, col-1), (row, col), (row, col+1), (row+1, col-1), (row+1, col), (row+1, col+1)])

        for row, col in list(safe_tiles):
            if row < 0 or row > 7 or col < 0 or col > 7:
                safe_tiles.remove((row, col))
                continue


            knight_cover = False
            knight_ids = [(row+2, col+1), (row+2, col-1), (row+1, col+2), (row+1, col-2), (row-2, col+1), (row-2, col-1), (row-1, col+2), (row-1, col-2)]
            for knight_row, knight_col in knight_ids:
                if knight_row < 0 or knight_row > 7 or knight_col < 0 or knight_col > 7:
                    continue
                if self.board[knight_row][knight_col] == 'K':
                    knight_cover = True
                    break

            if knight_cover:
                safe_tiles.remove((row, col))
                continue


            pawn_cover = False
            pawn_ids = [(row+1, col-1), (row+1, col+1)]
            for pawn_row, pawn_col in pawn_ids:
                if pawn_row < 0 or pawn_row > 7 or pawn_col < 0 or pawn_col > 7:
                    continue
                if self.board[pawn_row][pawn_col] == 'P':
                    pawn_cover = True
                    break

            if pawn_cover:
                safe_tiles.remove((row, col))
                continue


            cross_cover = False
            cross_row, cross_col = row, col
            while True:
                cross_row += 1
                cross_col += 1
                if cross_row > 7 or cross_col > 7:
                    break
                char = self.board[cross_row][cross_col]
                if char == 'Q' or char == 'B' or char == 'B':
                    cross_cover = True
                    break
                if char != ' ' and char != 'z':
                    break

            if cross_cover:
                safe_tiles.remove((row, col))
                continue

            cross_row, cross_col = row, col
            while True:
                cross_row += 1
                cross_col -= 1
                if cross_row > 7 or cross_col < 0:
                    break
                char = self.board[cross_row][cross_col]
                if char == 'Q' or char == 'B' or char == 'B':
                    cross_cover = True
                    break
                if char != ' ' and char != 'z':
                    break

            if cross_cover:
                safe_tiles.remove((row, col))
                continue

            cross_row, cross_col = row, col
            while True:
                cross_row -= 1
                cross_col += 1
                if cross_row < 0 or cross_col > 7:
                    break
                char = self.board[cross_row][cross_col]
                if char == 'Q' or char == 'B' or char == 'B':
                    cross_cover = True
                    break
                if char != ' ' and char != 'z':
                    break

            if cross_cover:
                safe_tiles.remove((row, col))
                continue

            cross_row, cross_col = row, col
            while True:
                cross_row -= 1
                cross_col -= 1
                if cross_row < 0 or cross_col < 0:
                    break
                char = self.board[cross_row][cross_col]
                if char == 'Q' or char == 'B' or char == 'B':
                    cross_cover = True
                    break
                if char != ' ' and char != 'z':
                    break

            if cross_cover:
                safe_tiles.remove((row, col))
                continue

            straight_cover = False
            straight_row, straight_col = row, col
            while True:
                straight_row += 1
                if straight_row > 7:
                    break
                char = self.board[straight_row][straight_col]
                if char == 'Q' or char == 'R':
                    straight_cover = True
                    break
                if char != ' ' and char != 'z':
                    break
                
            if straight_cover:
                safe_tiles.remove((row, col))
                continue

            straight_row, straight_col = row, col
            while True:
                straight_row -= 1
                if straight_row < 0:
                    break
                char = self.board[straight_row][straight_col]
                if char == 'Q' or char == 'R':
                    straight_cover = True
                    break
                if char != ' ' and char != 'z':
                    break
                
            if straight_cover:
                safe_tiles.remove((row, col))
                continue
            
            straight_row, straight_col = row, col
            while True:
                straight_col += 1
                if straight_col > 7:
                    break
                char = self.board[straight_row][straight_col]
                if char == 'Q' or char == 'R':
                    straight_cover = True
                    break
                if char != ' ' and char != 'z':
                    break
                
            if straight_cover:
                safe_tiles.remove((row, col))
                continue
            
            straight_row, straight_col = row, col
            while True:
                straight_col -= 1
                if straight_col < 0:
                    break
                char = self.board[straight_row][straight_col]
                if char == 'Q' or char == 'R':
                    straight_cover = True
                    break
                if char != ' ' and char != 'z':
                    break
                
            if straight_cover:
                safe_tiles.remove((row, col))
                continue

            
            king_cover = False
            king_ids = [(row-1, col-1), (row-1, col), (row-1, col+1), (row, col-1), (row, col+1), (row+1, col-1), (row+1, col), (row+1, col+1)]
            for king_row, king_col in king_ids:
                if king_row < 0 or king_row > 7 or king_col < 0 or king_col > 7:
                    continue
                if self.board[king_row][king_col] == 'Z':
                    king_cover = True
                    break
            
            if king_cover:
                safe_tiles.remove((row, col))
                continue
        
        return list(safe_tiles)




if __name__ == '__main__':
    board = Board()
    board.board = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'P', ' ', ' ', ' '],
        [' ', ' ', ' ', 'b', ' ', 'k', ' ', ' '],
        [' ', ' ', ' ', 'K', 'Q', 'z', ' ', ' '],
        [' ', ' ', ' ', 'Q', 'r', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
    result = board.king_moves((4, 5))
    print(result)
    print(len(result))