#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define SIZE 5
#define BOMBS 5

char board[SIZE][SIZE];
char display[SIZE][SIZE];

void init_board() {
    for (int i = 0; i < SIZE; i++)
        for (int j = 0; j < SIZE; j++)
            board[i][j] = '0';
}

void place_bombs() {
    int count = 0;
    while (count < BOMBS) {
        int x = rand() % SIZE;
        int y = rand() % SIZE;
        if (board[x][y] != 'B') {
            board[x][y] = 'B';
            count++;
        }
    }
}

void show_board() {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++)
            printf("%c ", display[i][j]);
        printf("\n");
    }
}

int dx[] = {-1, -1, -1, 0, 0, 1, 1, 1};
int dy[] = {-1, 0, 1, -1, 1, -1, 0, 1};

int count_adjacent_bombs(int x, int y) {
    int count = 0;
    for (int d = 0; d < 8; d++) {
        int nx = x + dx[d];
        int ny = y + dy[d];
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && board[nx][ny] == 'B')
            count++;
    }
    return count;
}

void calculate_numbers() {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            if (board[i][j] != 'B') {
                int bombs = count_adjacent_bombs(i, j);
                board[i][j] = bombs + '0';
            }
        }
    }
}

int main() {
    srand(time(0));
    init_board();
    place_bombs();
    calculate_numbers();

    for (int i = 0; i < SIZE; i++)
        for (int j = 0; j < SIZE; j++)
            display[i][j] = '*';

    int x, y;
    int revealed = 0;
    int total_to_reveal = SIZE * SIZE - BOMBS;
    while (1) {
        show_board();
        printf("Enter x y: ");
        scanf("%d %d", &x, &y);
        if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) {
            printf("Invalid coordinates. Try again.\n");
            continue;
        }
        if (display[x][y] != '*') {
            printf("Cell already revealed. Try another.\n");
            continue;
        }
        if (board[x][y] == 'B') {
            printf("Boom! Game Over\n");
            break;
        } else {
            display[x][y] = board[x][y];
            revealed++;
            if (revealed == total_to_reveal) {
                printf("Congratulations! You win!\n");
                show_board();
                break;
            }
        }
    }
    return 0;
}
