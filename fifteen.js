window.addEventListener('DOMContentLoaded', (event) => {
    const container = document.getElementById('puzzle-container');
    const emptySpace = { x: 3, y: 3 }; // Bottom right corner as the empty space
    let tiles = [];

    function isMovable(tile) {
        const x = parseInt(tile.style.left, 10) / 100;
        const y = parseInt(tile.style.top, 10) / 100;
        console.log(`Checking if tile ${tile.textContent} at (${x}, ${y}) is movable`);
        return (x === emptySpace.x && Math.abs(y - emptySpace.y) === 1) ||
               (y === emptySpace.y && Math.abs(x - emptySpace.x) === 1);
    }

    function updateMovableTiles() {
		console.log("Updating movable tiles");

        tiles.forEach(tile => {
            if (isMovable(tile)) {
				console.log(`Tile ${tile.textContent} is movable`);

                tile.classList.add('movablepiece');
            } else {
				console.log(`Tile ${tile.textContent} is not movable`);

                tile.classList.remove('movablepiece');
            }
        });
    }

    function moveTile(tile) {
        const x = parseInt(tile.style.left, 10) / 100;
        const y = parseInt(tile.style.top, 10) / 100;

        if (isMovable(tile)) {
            console.log(`Moving tile ${tile.textContent} from (${x}, ${y}) to empty space at (${emptySpace.x}, ${emptySpace.y})`);
            tile.style.top = `${emptySpace.y * 100}px`;
            tile.style.left = `${emptySpace.x * 100}px`;
            emptySpace.x = x;
            emptySpace.y = y;
            updateMovableTiles();
        } else {
            console.log(`Tile ${tile.textContent} at (${x}, ${y}) is not movable`);
        }
    }

    function shuffleTiles() {
        console.log("Shuffling tiles");
        for (let i = 0; i < 300; i++) {
            const movableTiles = tiles.filter(tile => isMovable(tile));
            if (movableTiles.length === 0) {
                console.log("No movable tiles found, skipping shuffle iteration");
                continue;
            }
            const randomIndex = Math.floor(Math.random() * movableTiles.length);
            const randomTile = movableTiles[randomIndex];
            console.log(`Shuffle iteration ${i}: moving tile ${randomTile.textContent}`);
            moveTile(randomTile);
        }
        console.log("Shuffling complete");
    }


    // Initialize the board
    for (let i = 0; i < 15; i++) {
        const tile = document.createElement('div');
        tile.id = 'tile' + (i + 1);
        tile.classList.add('tile');
        tile.textContent = (i + 1).toString();
        tile.style.left = `${(i % 4) * 100}px`;
        tile.style.top = `${Math.floor(i / 4) * 100}px`;
        tile.style.backgroundImage = 'url(background.jpg)';
        tile.style.backgroundPosition = `-${(i % 4) * 100}px -${Math.floor(i / 4) * 100}px`;
        if (i === 14) {
			console.log("Attaching event listeners to the last tile");}
        tile.addEventListener('click', () => {
			console.log(`Tile ${tile.textContent} clicked`);
            moveTile(tile);
        });
        tile.addEventListener('mouseenter', () => {
            if (isMovable(tile)) {
                tile.classList.add('movablepiece');
            }
        });
        tile.addEventListener('mouseleave', () => {
            tile.classList.remove('movablepiece');
        });
		
		tile.addEventListener('click', () => {
            console.log(`Tile ${tile.textContent} clicked`);
        });

    console.log(`Event listener added to tile ${tile.textContent}`);

        tiles.push(tile);
        container.appendChild(tile);
    }

    const lastTile = tiles[14]; // Assuming the last tile is at index 14
    lastTile.addEventListener('click', () => {
    console.log('Direct event listener: last tile clicked');
});
    // Add the empty tile for visual completeness (optional)
    const emptyTile = document.createElement('div');
    emptyTile.id = 'tile16';
    emptyTile.classList.add('tile');
    emptyTile.style.left = `${emptySpace.x * 100}px`;
    emptyTile.style.top = `${emptySpace.y * 100}px`;
	emptyTile.style.pointerEvents = 'none'; 
    container.appendChild(emptyTile);

    // Set up the shuffle button
    const shuffleButton = document.getElementById('shuffle-button');
    shuffleButton.addEventListener('click', () => {
        shuffleTiles();
        updateMovableTiles(); // Update movable tiles after shuffling
    });

    // Initial update of movable tiles
    updateMovableTiles();
	
	

	
});
