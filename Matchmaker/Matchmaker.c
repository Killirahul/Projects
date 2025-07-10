#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

#define ROWS 4
#define COLS 6
#define TOTAL_CELLS (ROWS * COLS)
#define TIME_LIMIT 60  // seconds

char board[ROWS][COLS];
char display[ROWS][COLS];
int matched[ROWS][COLS] = {0};

void shuffle(char *array, int size) {
    srand(time(NULL));
    for (int i = size - 1; i > 0; i--) {
        int j = rand() % (i + 1);
        char temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

void initialize_board() {
    char symbols[TOTAL_CELLS];
    int k = 0;
    for (char ch = 'A'; k < TOTAL_CELLS / 2; ch++) {
        symbols[k++] = ch;
        symbols[k++] = ch;
    }

    shuffle(symbols, TOTAL_CELLS);

    k = 0;
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            board[i][j] = symbols[k++];
            display[i][j] = '*';
        }
    }
}

void print_board() {
    printf("\n    ");
    for (int j = 0; j < COLS; j++)
        printf("%2d ", j);
    printf("\n");

    for (int i = 0; i < ROWS; i++) {
        printf("%2d: ", i);
        for (int j = 0; j < COLS; j++) {
            printf(" %c ", display[i][j]);
        }
        printf("\n");
    }
}

void reveal(int x, int y) {
    display[x][y] = board[x][y];
}

void hide(int x1, int y1, int x2, int y2) {
    display[x1][y1] = '*';
    display[x2][y2] = '*';
}

int is_won() {
    for (int i = 0; i < ROWS; i++)
        for (int j = 0; j < COLS; j++)
            if (!matched[i][j])
                return 0;
    return 1;
}

int main() {
    int x1, y1, x2, y2;
    int found = 0;

    initialize_board();

    time_t start_time = time(NULL);

    while (1) {
        system("clear");  // use "cls" on Windows
        time_t now = time(NULL);
        int remaining = TIME_LIMIT - (int)(now - start_time);

        if (remaining <= 0) {
            printf("\n⏰ Time's up! 😢 You Lost!\n");
            break;
        }

        printf("\n⏳ Time Left: %d seconds", remaining);
        print_board();

        printf("\nEnter first card (row col): ");
        scanf("%d %d", &x1, &y1);
        if (matched[x1][y1] || display[x1][y1] != '*') {
            printf("Invalid move.\n");
            getchar(); getchar(); // wait for enter
            continue;
        }

        reveal(x1, y1);
        system("clear");
        printf("\n⏳ Time Left: %d seconds", remaining);
        print_board();

        printf("\nEnter second card (row col): ");
        scanf("%d %d", &x2, &y2);
        if (matched[x2][y2] || (x1 == x2 && y1 == y2) || display[x2][y2] != '*') {
            printf("Invalid move.\n");
            hide(x1, y1, x1, y1); // hide first back
            getchar(); getchar();
            continue;
        }

        reveal(x2, y2);
        system("clear");
        printf("\n⏳ Time Left: %d seconds", remaining);
        print_board();

        if (board[x1][y1] == board[x2][y2]) {
            printf("\n✔ Match Found!\n");
            matched[x1][y1] = matched[x2][y2] = 1;
            found++;
        } else {
            printf("\n✖ Not a Match.\n");
            hide(x1, y1, x2, y2);
        }

        if (is_won()) {
            printf("\n🎉 You Won! All pairs matched in time.\n");
            break;
        }

        printf("Press Enter to continue...");
        getchar(); getchar();
    }

    return 0;
}