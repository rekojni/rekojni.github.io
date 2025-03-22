import pygame
import sys
from pygame.locals import *
import random

# Initialize Pygame
pygame.init()

# Screen dimensions
WIDTH, HEIGHT = 540, 600

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (200, 200, 200)
BLUE = (0, 0, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)

# Fonts
FONT = pygame.font.SysFont('Arial', 40)
SMALL_FONT = pygame.font.SysFont('Arial', 20)
TITLE_FONT = pygame.font.SysFont('Arial', 60)

# Difficulty levels
DIFFICULTIES = {
    'Easy': 30,
    'Medium': 45,
    'Hard': 60
}

class Button:
    def __init__(self, text, x, y, width, height, color, hover_color):
        self.text = text
        self.rect = pygame.Rect(x, y, width, height)
        self.color = color
        self.hover_color = hover_color
        self.hovered = False

    def draw(self, screen):
        color = self.hover_color if self.hovered else self.color
        pygame.draw.rect(screen, color, self.rect)
        text_surf = FONT.render(self.text, True, BLACK)
        text_rect = text_surf.get_rect(center=self.rect.center)
        screen.blit(text_surf, text_rect)

    def check_hover(self, mouse_pos):
        self.hovered = self.rect.collidepoint(mouse_pos)

    def is_clicked(self, mouse_pos):
        return self.rect.collidepoint(mouse_pos)

def show_welcome_screen():
    screen.fill(WHITE)
    title = TITLE_FONT.render('Sudoku', True, BLACK)
    title_rect = title.get_rect(center=(WIDTH//2, 100))
    screen.blit(title, title_rect)

    buttons = [
        Button('Easy', WIDTH//2 - 100, 200, 200, 50, GRAY, BLUE),
        Button('Medium', WIDTH//2 - 100, 275, 200, 50, GRAY, BLUE),
        Button('Hard', WIDTH//2 - 100, 350, 200, 50, GRAY, BLUE)
    ]

    while True:
        for event in pygame.event.get():
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == MOUSEMOTION:
                for button in buttons:
                    button.check_hover(event.pos)
            elif event.type == MOUSEBUTTONDOWN:
                for button in buttons:
                    if button.is_clicked(event.pos):
                        return DIFFICULTIES[button.text]

        for button in buttons:
            button.draw(screen)

        pygame.display.flip()
        clock.tick(30)

# Initialize screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Sudoku')

# Clock for controlling the frame rate
clock = pygame.time.Clock()

# Sudoku grid
board = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
]

original_board = [row[:] for row in board]
selected = None
errors = []

def is_valid(board, row, col, num):
    # Check row
    if num in board[row]:
        return False
    
    # Check column
    if num in [board[i][col] for i in range(9)]:
        return False
    
    # Check 3x3 box
    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False
    return True

def find_empty_cells(board):
    return [(i, j) for i in range(9) for j in range(9) if board[i][j] == 0]

def get_hint():
    empty_cells = find_empty_cells(board)
    if not empty_cells:
        return None
    
    row, col = random.choice(empty_cells)
    for num in range(1, 10):
        if is_valid(board, row, col, num):
            return (row, col, num)
    return None

def validate_board():
    global errors
    errors = []
    for i in range(9):
        for j in range(9):
            if board[i][j] != 0:
                # Check row
                if board[i].count(board[i][j]) > 1:
                    errors.append((i, j))
                # Check column
                if [board[k][j] for k in range(9)].count(board[i][j]) > 1:
                    errors.append((i, j))
                # Check 3x3 box
                start_row, start_col = 3 * (i // 3), 3 * (j // 3)
                box = [board[start_row + x][start_col + y] for x in range(3) for y in range(3)]
                if box.count(board[i][j]) > 1:
                    errors.append((i, j))

def draw_grid():
    for i in range(10):
        if i % 3 == 0:
            thickness = 4
        else:
            thickness = 1
        pygame.draw.line(screen, BLACK, (i * 60, 0), (i * 60, 540), thickness)
        pygame.draw.line(screen, BLACK, (0, i * 60), (540, i * 60), thickness)

def draw_numbers():
    for i in range(9):
        for j in range(9):
            if board[i][j] != 0:
                color = BLACK if original_board[i][j] != 0 else BLUE
                num = FONT.render(str(board[i][j]), True, color)
                num_rect = num.get_rect(center=(j * 60 + 30, i * 60 + 30))
                screen.blit(num, num_rect)

def draw_errors():
    for (i, j) in errors:
        pygame.draw.rect(screen, RED, (j * 60, i * 60, 60, 60), 3)

def select_cell(pos):
    global selected
    x, y = pos
    if 0 <= x < 540 and 0 <= y < 540:
        selected = (y // 60, x // 60)
    else:
        selected = None

def handle_key_press(key):
    if selected:
        i, j = selected
        if pygame.K_1 <= key <= pygame.K_9 and original_board[i][j] == 0:
            board[i][j] = key - pygame.K_0
            validate_board()
        elif key == pygame.K_BACKSPACE or key == pygame.K_DELETE:
            if original_board[i][j] == 0:
                board[i][j] = 0
                validate_board()
        elif key == pygame.K_h:
            hint = get_hint()
            if hint:
                row, col, num = hint
                board[row][col] = num
                validate_board()

def main():
    global selected
    difficulty = show_welcome_screen()
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == QUIT:
                running = False
            elif event.type == MOUSEBUTTONDOWN:
                select_cell(pygame.mouse.get_pos())
            elif event.type == KEYDOWN:
                handle_key_press(event.key)

        screen.fill(WHITE)
        draw_grid()
        draw_numbers()
        draw_errors()
        if selected:
            pygame.draw.rect(screen, BLUE, (selected[1] * 60, selected[0] * 60, 60, 60), 3)
        pygame.display.flip()
        clock.tick(30)

    pygame.quit()
    sys.exit()

if __name__ == '__main__':
    main()
