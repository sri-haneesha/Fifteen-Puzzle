window.addEventListener('DOMContentLoaded', (event) => {

    document.getElementById('darkModeToggle').addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
    });

    const container = document.getElementById('puzzle-container');
    const emptySpace = { x: 2, y: 2 };
    let tiles = [];

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
                    timerElement = document.getElementById('timer'); // Make sure this ID exists in your HTML
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

    function moveTile(tile) {
        const x = parseInt(tile.style.left, 10) / 100;
        const y = parseInt(tile.style.top, 10) / 100;

        if (isMovable(tile)) {
            tile.style.top = `${emptySpace.y * 100}px`;
            tile.style.left = `${emptySpace.x * 100}px`;
            emptySpace.x = x;
            emptySpace.y = y;
            updateMovableTiles();

            if (checkWin()) {
                showWinningNotification();
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
            moveTile(randomTile);
        }
        updateMovableTiles();
        if (checkWin()) {
            shuffleTiles();
        }
    }

    function playSound() {
        const audio = new Audio('music.mp3');
        audio.play();
    }
    function stopSound() {
        const audio = new Audio('music.mp3');
        audio.stop();
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
        timerModule.stop();
        alert("Puzzle Solved!");
        playSound();
        return true;
    }

    function showWinningNotification() {
        const winningMessage = document.createElement('div');
        winningMessage.textContent = 'Congratulations! You solved the puzzle!';
        winningMessage.className = 'winning-message';
        container.appendChild(winningMessage);
    }

    for (let i = 0; i < 8; i++) {
        const tile = document.createElement('div');
        tile.id = 'tile' + (i + 1);
        tile.classList.add('tile');
        tile.textContent = (i + 1).toString();
        tile.style.left = `${(i % 3) * 100}px`;
        tile.style.top = `${Math.floor(i / 3) * 100}px`;
        tile.style.backgroundImage = 'url(background2.jpeg)';
        tile.style.backgroundPosition = `-${(i % 3) * 100}px -${Math.floor(i / 3) * 100}px`;
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
        updateMovableTiles(); // Update movable tiles after shuffling
        timerModule.reset(); // Reset the timer to 0
        timerModule.start(); // Start the timer
        stopSound();
    });

    

    // function logicalSolvePuzzle() {
    //     let interval = setInterval(() => {
    //         const movableTiles = tiles.filter(tile => isMovable(tile));
    //         if (movableTiles.length > 0) {
    //             const randomTile = movableTiles[Math.floor(Math.random() * movableTiles.length)];
    //             moveTile(randomTile);
    //         }
    
    //         if (checkWin()) {
    //             clearInterval(interval);
    //             alert("Puzzle Solved!");
    //         }
    //     }, 100); // Adjust the interval as needed
    // }
    
    // // Modify the event listener for the solve button
    // const cheatButton = document.getElementById('cheat-button');
    // cheatButton.addEventListener('click', logicalSolvePuzzle);

    updateMovableTiles(); 
});
