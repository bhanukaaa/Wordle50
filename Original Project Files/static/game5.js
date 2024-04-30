import dictionary from './dict5.js';

// GAME TYPE VARIABLES
let wordLength = 5
let noOfTries = 6


const gameData = {
    grid: [],
    correctWord: dictionary[Math.floor( Math.random() * dictionary.length)],
    currentRow: 0,
    currentCol: 0
}


function displayCell(div, row, column, letter = '') {
    const cell = document.createElement('div')
    cell.className = 'cell'
    cell.id = 'cell' + row + column
    cell.textContent = letter

    div.appendChild(cell)
    return cell
}


function displayGame (div) {
    const grid = document.createElement('div')
    grid.className = 'grid5'

    for (let row = 0; row < noOfTries; row++) {
        for (let col = 0; col < wordLength; col++) {
            displayCell(grid, row, col)
        }
    }
    div.appendChild(grid)
}


function refresh() {
    for (let row = 0; row < noOfTries; row++) {
        for (let col = 0; col < wordLength; col++) {
            const cell = document.getElementById('cell'+row+col)
            cell.textContent = gameData.grid[row][col]
        }
    }
}


function keystrokes() {
    document.body.onkeydown = (event) => {
        const key = event.key
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        if (letters.includes(key)) {
            if (gameData.currentCol !== wordLength) {
                gameData.grid[gameData.currentRow][gameData.currentCol] = key
                gameData.currentCol++
                refresh()
            }
        }

        if (key === 'Enter') {
            if (gameData.currentCol === wordLength) {
                const word = getCurrentWord()
                if (dictionary.includes(word)) {
                    colorizeCells(word)
                    gameData.currentRow++
                    gameData.currentCol = 0
                    refresh()
                } else {
                    alert("Not a valid word")
                }
            }
        }

        if (key === 'Backspace') {
            if (gameData.currentCol !== 0) {
                gameData.grid[gameData.currentRow][gameData.currentCol - 1] = '';
                gameData.currentCol--
                refresh()
            }
        }
    }
}


function getCurrentWord() {
    let word = ""
    for (let i = 0; i < wordLength; i++) {
        word += gameData.grid[gameData.currentRow][i]
    }
    return word
}


function colorizeCells(word) {
    const row = gameData.currentRow

    for (let col = 0; col < wordLength; col++) {
        const cell = document.getElementById('cell'+row+col)
        const letter = cell.textContent

        setTimeout(() => {
            if (letter === gameData.correctWord[col]) {
                cell.classList.add('correct')
            } else if (gameData.correctWord.includes(letter)) {
                cell.classList.add('present')
            } else {
                cell.classList.add('absent')
            }
        }, ((col+1)*250))
        cell.classList.add('animated')
        cell.style.animationDelay = `${(col * 500)/2}ms`
    }

    setTimeout(() => {
        winHandler(word)
    }, 2000)
}


function winHandler(word) {
    if (gameData.correctWord === word) {
        let points = calcPoints()
        submitScore(points)
        const gameDiv = document.getElementById("wordle")
        gameDiv.innerHTML = `
        <div>
            <img src="/static/congrats.png" width="500px"><br><br>
            <p>The Word was <span class="correctword">${gameData.correctWord}</span></p>
            <p>For guessing it in ${gameData.currentRow} tries, You've been awarded ${points} Points.</p>
            <a href="/play${wordLength}" class="btn btn-secondary mt-auto">Play Again</a>
            <br><br>
            <a href="/leaderboard" class="btn btn-secondary mt-auto">View Leaderboard</a>
        </div>
        `
    } else if (gameData.currentRow === noOfTries) {
        const gameDiv = document.getElementById("wordle")
        gameDiv.innerHTML = `
        <div>
            <img src="/static/nicetry.png" width="400px"><br><br>
            <p>The Word was <span class="correctword">${gameData.correctWord}</span></p>
            <a href="/play${wordLength}" class="btn btn-secondary mt-auto">Try Again</a>
            <br><br>
            <a href="/leaderboard" class="btn btn-secondary mt-auto">View Leaderboard</a>
        </div>
        `
    }
}


function calcPoints() {
    return (noOfTries + 1 - (gameData.currentRow)) * wordLength
}


function submitScore(points) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/submit_score", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    var data = JSON.stringify({
      "points": points
    });

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("Score submitted successfully!");
      }
    };

    xhr.send(data);
  }


function startGame() {
    const game = document.getElementById('wordle')

    while (gameData.correctWord.length != wordLength) {
        gameData.correctWord = dictionary[Math.floor( Math.random() * dictionary.length)]
    }
    displayGame(game)
    for (let i = 0; i < noOfTries; i++) {
        gameData.grid.push(['','','','',''])
    }

    keystrokes()
    console.log("For Testing purposes only")
    console.log("The correct word is: " + gameData.correctWord)
}


startGame()