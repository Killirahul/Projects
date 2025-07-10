import random

class Cell:
    def __init__(self):
        self.is_bomb = False
        self.revealed = False
        self.adjacent_bombs = 0

class Minesweeper:
    def __init__(self, size=5, bombs=5):
        self.size = size
        self.board = [[Cell() for _ in range(size)] for _ in range(size)]
        self.bombs = bombs
        self.place_bombs()
        self.calculate_adjacent()

    def place_bombs(self):
        count = 0
        while count < self.bombs:
            x, y = random.randint(0, self.size-1), random.randint(0, self.size-1)
            if not self.board[x][y].is_bomb:
                self.board[x][y].is_bomb = True
                count += 1

    def calculate_adjacent(self):
        for x in range(self.size):
            for y in range(self.size):
                if self.board[x][y].is_bomb:
                    continue
                for dx in [-1, 0, 1]:
                    for dy in [-1, 0, 1]:
                        nx, ny = x+dx, y+dy
                        if 0 <= nx < self.size and 0 <= ny < self.size and self.board[nx][ny].is_bomb:
                            self.board[x][y].adjacent_bombs += 1

    def reveal(self, x, y):
        if not (0 <= x < self.size and 0 <= y < self.size): return
        cell = self.board[x][y]
        if cell.revealed: return
        cell.revealed = True
        if cell.adjacent_bombs == 0 and not cell.is_bomb:
            for dx in [-1, 0, 1]:
                for dy in [-1, 0, 1]:
                    if dx != 0 or dy != 0:
                        self.reveal(x+dx, y+dy)

    def display(self):
        for row in self.board:
            print(' '.join('B' if cell.is_bomb and cell.revealed else
                           str(cell.adjacent_bombs) if cell.revealed else '*' for cell in row))

# Run Game
game = Minesweeper()
while True:
    game.display()
    x, y = map(int, input("Enter coordinates (x y): ").split())
    if game.board[x][y].is_bomb:
        print("Game Over!")
        game.board[x][y].revealed = True
        game.display()
        break
    game.reveal(x, y)
