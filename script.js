document.addEventListener("DOMContentLoaded", () => {
    const img = new Image();
    img.src = 'img/bratz.jpg';

    let emptyIndex = 16;
    let pieces = [];
    let selectedPieces = [];

    img.onload = function() {
        createPuzzle();
    };

    const puzzleContainer = document.getElementById('puzzle-container');
    const statusText = document.getElementById('status');

    function createPuzzle() {
        for (let i = 0; i < 16; i++) {
            const piece = document.createElement('div');
            piece.className = 'piece';
            piece.style.backgroundImage = `url('${img.src}')`;
            piece.style.backgroundPosition = `-${(i % 4) * 100}px -${Math.floor(i / 4) * 100}px`;
            piece.dataset.index = i;
            piece.onclick = () => pieceClicked(piece);
            pieces.push(piece);
            puzzleContainer.appendChild(piece);
        }
        const emptyPiece = document.createElement('div');
        emptyPiece.className = 'piece empty';
        pieces.push(emptyPiece);
        puzzleContainer.appendChild(emptyPiece);

        shufflePieces();
    }

    function shufflePieces() {
        let shuffledPieces = [...Array(16).keys()];
        do {
            shuffledPieces.sort(() => Math.random() - 0.5);
        } while (!isSolvable(shuffledPieces));

        pieces.forEach((piece, index) => {
            const newIndex = shuffledPieces[index];
            piece.style.display = 'block';
            piece.dataset.index = newIndex;
            piece.style.backgroundPosition = `-${(newIndex % 4) * 100}px -${Math.floor(newIndex / 4) * 100}px`;
        });

        puzzleContainer.innerHTML = '';
        pieces.forEach(piece => puzzleContainer.appendChild(piece));
        pieces[emptyIndex].style.display = 'none';
    }

    function isSolvable(puzzle) {
        let inversions = 0;
        for (let i = 0; i < puzzle.length; i++) {
            for (let j = i + 1; j < puzzle.length; j++) {
                if (puzzle[i] > puzzle[j] && puzzle[j] !== 15) {
                    inversions++;
                }
            }
        }
        return inversions % 2 === 0;
    }

    function pieceClicked(piece) {
        const index = parseInt(piece.dataset.index);

        if (selectedPieces.length < 2) {
            selectedPieces.push(piece);
            piece.classList.add('selected');

            if (selectedPieces.length === 2) {
                swapPieces(selectedPieces[0], selectedPieces[1]);
                selectedPieces.forEach(p => p.classList.remove('selected'));
                selectedPieces = [];
                emptyIndex = parseInt(pieces.findIndex(piece => piece.classList.contains('empty')));
            }
        }
        checkCompletion();
    }

    function swapPieces(piece1, piece2) {
        const index1 = parseInt(piece1.dataset.index);
        const index2 = parseInt(piece2.dataset.index);

        const tempIndex = piece1.dataset.index;
        piece1.dataset.index = piece2.dataset.index;
        piece2.dataset.index = tempIndex;

        const tempPosition = piece1.style.backgroundPosition;
        piece1.style.backgroundPosition = piece2.style.backgroundPosition;
        piece2.style.backgroundPosition = tempPosition;

        pieces[index1].style.display = 'block';
        pieces[index2].style.display = 'block';
    }

    function checkCompletion() {
        return pieces.every((piece, index) => {
            return parseInt(piece.dataset.index) === index || piece.classList.contains('empty');
        });
    }

    const shuffleButton = document.getElementById('shuffle-button');
    if (shuffleButton) {
        shuffleButton.addEventListener('click', shufflePieces);
    }

    const completeButton = document.getElementById('complete-button');
    if (completeButton) {
        completeButton.addEventListener('click', () => {
            if (checkCompletion()) {
                window.location.href = "completato.html";
            } else {
                alert("Il puzzle non è ancora finito!");
            }
        });
    }
});
