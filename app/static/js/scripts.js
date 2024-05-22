document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const keyboard = document.getElementById('keyboard');
    const rows = 6;
    const cols = 5;
    let currentRow = 0;
    let currentCol = 0;
    let currentGuess = [];
    let gameActive = true;

    // Create the grid
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        grid.appendChild(cell);
    }

    // Create the keyboard
    const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
    keys.forEach(key => {
        const button = document.createElement('button');
        button.textContent = key;
        button.addEventListener('click', () => handleKey(key));
        keyboard.appendChild(button);
    });

    const enterButton = document.createElement('button');
    enterButton.textContent = 'Enter';
    enterButton.addEventListener('click', submitGuess);
    keyboard.appendChild(enterButton);

    const backspaceButton = document.createElement('button');
    backspaceButton.innerHTML = '&#9003;';
    backspaceButton.addEventListener('click', deleteLetter);
    keyboard.appendChild(backspaceButton);

    function handleKey(key) {
        if (currentCol < cols && gameActive) {
            const cell = grid.children[currentRow * cols + currentCol];
            cell.textContent = key;
            currentGuess.push(key);
            currentCol++;
        }
    }

    function deleteLetter() {
        if (currentCol > 0 && gameActive) {
            currentCol--;
            const cell = grid.children[currentRow * cols + currentCol];
            cell.textContent = '';
            currentGuess.pop();
        }
    }

    function submitGuess() {
        if (currentCol === cols && gameActive) {
            const guess = currentGuess.join('');
            fetch('/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ guess: guess })
            })
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < cols; i++) {
                    const cell = grid.children[currentRow * cols + i];
                    cell.classList.add(data.result[i]);
                }
                if (data.result.every(status => status === 'correct')) {
                    disableKeyboard(); // Disable the keyboard
                    createResetButton(); // Allow for regeneration
                    setTimeout(function() {
                        alert('Congratulations! You guessed the word!');
                        gameActive = false; // Stop the game
                    }, 100);
                } else {
                    if (currentRow < rows - 1) {
                        currentRow++;
                        currentCol = 0;
                        currentGuess = [];
                    } else {
                        disableKeyboard(); // Disable the keyboard
                        createResetButton(); // Allow for regeneration
                        setTimeout(function() {
                            alert(`Game over! The word was ${secretWord}`);
                            gameActive = false; // Stop the game
                        }, 100);
                    }
                }
            });
        }
    }

    function disableKeyboard() {
        const buttons = keyboard.getElementsByTagName('button');
        for (let button of buttons) {
            button.disabled = true;
        }
    }

    function createResetButton() {
        const resetButton = document.createElement('button');
        resetButton.textContent = 'New Game';
        resetButton.classList.add('reset-button');
        resetButton.addEventListener('click', () => {
            window.location.reload();
        });
        document.body.appendChild(resetButton);
    }

    document.addEventListener("keydown", (event) => {
        const keyPressed = event.key.toUpperCase();
        if (/^[A-Z]$/.test(keyPressed)) {
            handleKey(keyPressed);
            event.preventDefault();
        } else if (event.key === 'Enter') {
            submitGuess();
            event.preventDefault();
        } else if (event.key === 'Backspace') {
            deleteLetter();
            event.preventDefault();
        }
    })

});
