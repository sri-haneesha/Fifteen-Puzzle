window.addEventListener('DOMContentLoaded', (event) => {

    document.getElementById('darkModeToggle').addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
    });

    const container = document.getElementById('puzzle-container');
    const emptySpace = { x: 3, y: 3 }; // Bottom right corner as the empty space //PARAM
    let tiles = [];
    let audio = new Audio('music.mp3'); // Globally declared audio object
    let moveCount = 0;

    const timerModule = (function () {
        let time = 0;
        let intervalId = null;
        let timerElement = null;

        const tick = () => {
            time++;
            timerElement.textContent = `Time: ${time} s`;
        };

        return {
            start: function () {
                if (intervalId === null) {
                    timerElement = document.getElementById('timer');
                    intervalId = setInterval(tick, 1000);
                }
            },
            stop: function () {
                if (intervalId !== null) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            },
            reset: function () {
                time = 0;
                if (timerElement) {
                    timerElement.textContent = `Time: 0 s`;
                }
            },
            getTime: function () {
                return time;
            }
        };
    })();

    function isMovable(tile) {
        const x = parseInt(tile.style.left, 10) / 100;
        const y = parseInt(tile.style.top, 10) / 100;
        return (x === emptySpace.x && Math.abs(y - emptySpace.y) === 1) ||
               (y === emptySpace.y && Math.abs(x - emptySpace.x) === 1);
    }

    function updateMovableTiles() {
        tiles.forEach(tile => {
            if (isMovable(tile)) {
                tile.classList.add('movablepiece');
            } else {
                tile.classList.remove('movablepiece');
            }
        });
    }

    let hasShuffled = false;

    function moveTile(tile, isShuffling = false) {
        const x = parseInt(tile.style.left, 10) / 100;
        const y = parseInt(tile.style.top, 10) / 100;
    
        if (isMovable(tile)) {
            tile.style.top = `${emptySpace.y * 100}px`;
            tile.style.left = `${emptySpace.x * 100}px`;
            emptySpace.x = x;
            emptySpace.y = y;
            updateMovableTiles();
    
            if (!isShuffling) {
                moveCount++; // Increment move count only if not shuffling
                document.getElementById('moveCounter').textContent = `Moves: ${moveCount}`;
            }
    
            if (!isShuffling && hasShuffled && checkWin()) {
                showWinningNotification();
                playSound();
                timerModule.stop();
                hasShuffled = false;
            }
        }
    }

    function shuffleTiles() {
        for (let i = 0; i < 300; i++) {
            const movableTiles = tiles.filter(tile => isMovable(tile));
            if (movableTiles.length === 0) {
                continue;
            }
            const randomIndex = Math.floor(Math.random() * movableTiles.length);
            const randomTile = movableTiles[randomIndex];
            moveTile(randomTile, true); 
        }
        moveCount = 0; // Reset move count after shuffling is complete
        document.getElementById('moveCounter').textContent = `Moves: ${moveCount}`; // Update move count display
        updateMovableTiles();
        if (checkWin()) {
            shuffleTiles();
        }
    }

    function playSound() {
        audio.play();
    }

    function stopSound() {
        audio.pause();
        audio.currentTime = 0;
    }

    const btn = document.getElementById('bttn');
    btn.addEventListener('click', () => {
        stopSound();
    });

    function checkWin() {
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            const x = parseInt(tile.style.left, 10) / 100;
            const y = parseInt(tile.style.top, 10) / 100;
            if (x !== (i % 3) || y !== Math.floor(i / 3)) {
                return false;
            }
        }
        return true;
    }

function showWinningNotification() {
    // Hide all elements in the body except the home button
    Array.from(document.body.children).forEach(child => {
        if (child.id !== 'bttn') {
            child.style.display = 'none';
        }
    });

    // Set the background image of the entire page to bg3.png
    document.documentElement.style.height = '100%';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.backgroundImage = 'url(bg3.png)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';

    // Position the home button at the bottom of the page
    const homeButton = document.getElementById('bttn');
    homeButton.style.position = 'absolute';
    homeButton.style.bottom = '20px';
    homeButton.style.left = '50%';
    homeButton.style.transform = 'translateX(-50%)';
    homeButton.style.zIndex = 1000; // Ensure it's above the background

    // Create and display the winning message
    const winningMessage = document.createElement('div');
    winningMessage.textContent = 'Congratulations! You solved the puzzle!';
    winningMessage.className = 'winning-message';
    winningMessage.style.position = 'absolute';
    winningMessage.style.top = '50%';
    winningMessage.style.left = '50%';
    winningMessage.style.transform = 'translate(-50%, -50%)';
    winningMessage.style.fontSize = '2em';
    winningMessage.style.color = 'black';
    winningMessage.style.textAlign = 'center';
    winningMessage.style.zIndex = 1000; // Ensure it's above the background

    // Calculate best time and moves
    const bestTime = localStorage.getItem('bestTime');
    const bestMoves = localStorage.getItem('bestMoves');
    const currentTime = timerModule.getTime();

    if (bestTime === null || currentTime < bestTime) {
        localStorage.setItem('bestTime', currentTime);
    }

    if (bestMoves === null || moveCount < bestMoves) {
        localStorage.setItem('bestMoves', moveCount);
    }


    // Update the winning message text with current and best times and moves
    winningMessage.innerHTML = `Congratulations! You solved the puzzle!<br>` +
        `Time: ${currentTime} s<br>` +
        `Moves: ${moveCount}<br>` +
        `Best Time: ${localStorage.getItem('bestTime')} s<br>` +
        `Best Moves: ${localStorage.getItem('bestMoves')}`;
    document.body.appendChild(winningMessage);
}





    for (let i = 0; i < 15; i++) { //PARAM
        const tile = document.createElement('div');
        tile.id = 'tile' + (i + 1);
        tile.classList.add('tile');
        tile.textContent = (i + 1).toString();
        tile.style.left = `${(i % 4) * 100}px`; //PARAM
        tile.style.top = `${Math.floor(i / 4) * 100}px`; //PARAM
        tile.style.backgroundImage = 'url(background.jpg)'; //PARAM
        tile.style.backgroundPosition = `-${(i % 4) * 100}px -${Math.floor(i / 4) * 100}px`; //PARAM
        tile.addEventListener('click', () => moveTile(tile));
        tile.addEventListener('mouseenter', () => {
            if (isMovable(tile)) {
                tile.classList.add('movablepiece');
            }
        });
        tile.addEventListener('mouseleave', () => {
            tile.classList.remove('movablepiece');
        });
        tiles.push(tile);
        container.appendChild(tile);
    }

    const shuffleButton = document.getElementById('shuffle-button');
    shuffleButton.addEventListener('click', () => {
        shuffleTiles();
        updateMovableTiles();
        timerModule.reset();
        timerModule.start();
        stopSound();
        hasShuffled = true;
    });

    updateMovableTiles();
});
