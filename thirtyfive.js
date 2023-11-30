window.addEventListener('DOMContentLoaded', (event) => {
    const container = document.getElementById('puzzle-container');
    const emptySpace = { x: 5, y: 5 };
    let tiles = [];

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
        const winningMessage = document.createElement('div');
        winningMessage.textContent = 'Congratulations! You solved the puzzle!';
        winningMessage.className = 'winning-message';
        container.appendChild(winningMessage);
    }

    for (let i = 0; i < 35; i++) {
        const tile = document.createElement('div');
        tile.id = 'tile' + (i + 1);
        tile.classList.add('tile');
        tile.textContent = (i + 1).toString();
        tile.style.left = `${(i % 6) * 100}px`;
        tile.style.top = `${Math.floor(i / 6) * 100}px`;
        tile.style.backgroundImage = 'url(background1.png)';
        tile.style.backgroundPosition = `-${(i % 6) * 100}px -${Math.floor(i / 6) * 100}px`;
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
    });

    function solvePuzzle() {
        let counter = 1;
        for (let y = 0; y < 6; y++) { 
            for (let x = 0; x < 6; x++) {
                if (y === 5 && x === 5) { 
                    break;
                }
                const tile = document.getElementById('tile' + counter);
                tile.style.left = `${x * 100}px`;
                tile.style.top = `${y * 100}px`;
                counter++;
            }
        }
        emptySpace.x = 5; 
        emptySpace.y = 5;
    }
    
    const cheatButton = document.getElementById('cheat-button');
    cheatButton.addEventListener('click', solvePuzzle);

    updateMovableTiles(); 
});
