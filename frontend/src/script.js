const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');

const postGameOptions = document.getElementById('postGameOptions');
const restartButton = document.getElementById('restartButton');

const menuButton = document.getElementById('menuButton');
const menuButtonPostGame = document.getElementById('menuButtonPostGame');

import { io } from "socket.io-client"

let playerName = '';
let esAnfitrion = false;

document.addEventListener('DOMContentLoaded', () => {
    const playerNameInput = document.getElementById('playerNameInput');
    const submitNameButton = document.getElementById('submitNameButton');
    const gameContainer = document.getElementById('gameContainer');
    const playerNameInputArea = document.getElementById('playerNameInputArea');

    submitNameButton.addEventListener('click', () => {
        playerName = playerNameInput.value.trim();
        if (playerName) {
            gameContainer.style.display = 'block'; 
            playerNameInputArea.style.display = 'none'; 
        } else {
            alert('Por favor, introduce un nombre.');
        }
    });
});

const socket = io("http://localhost:4000")

socket.on('connect', () => {
    console.log("Conectado al servidor");
});

let tuSalaId;

const generarIdSala = () => {
    return Math.random().toString(36).substr(2, 9);
};

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width  = 0;
ctx.canvas.height = 0;

const bodyParts = [
    [4,2,1,1],
    [4,3,1,2],
    [3,5,1,1],
    [5,5,1,1],
    [3,3,1,1],
    [5,3,1,1]
];


let selectedWord = [];
let usedLetters;
let mistakes;
let hits;

const addLetter = letter => {
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter.toUpperCase();
    usedLettersElement.appendChild(letterElement);
}

const addBodyPart = bodyPart => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(...bodyPart);
};

const letterInput = letter => {
    if (!usedLetters.includes(letter)) {
        socket.emit('adivinar-letra', { letra: letter, salaId: tuSalaId });
        addLetter(letter);
        usedLetters.push(letter);
    }
};

const letterEvent = event => {
    let newLetter = event.key.toUpperCase();
    if(newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
        letterInput(newLetter);      
    };
};

const drawWord = () => {
    wordContainer.innerHTML = ''; 
    selectedWord.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.innerHTML = usedLetters.includes(letter) ? letter.toUpperCase() : '_';
        letterElement.classList.add('letter');
        if (usedLetters.includes(letter)) {
            letterElement.classList.remove('hidden');
        }
        wordContainer.appendChild(letterElement);
    });
};


const drawHangMan = () => {
    ctx.canvas.width  = 120;
    ctx.canvas.height = 160;
    ctx.scale(20, 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#544eae';
    ctx.fillRect(0, 7, 4, 1);
    ctx.fillRect(1, 0, 1, 8);
    ctx.fillRect(2, 0, 3, 1);
    ctx.fillRect(4, 1, 1, 1);
};

const startGame = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    
    drawHangMan();
    drawWord();
};

startButton.addEventListener('click', () => {
    if (!playerName) {
        alert('Por favor, introduce tu nombre primero.');
        return;
    }
    esAnfitrion = true;
    tuSalaId = generarIdSala(); 
    socket.emit('crear-juego', { salaId: tuSalaId, playerName: playerName });

    document.querySelector('.input-group-join').style.display = 'none';
    document.getElementById('salaInfo').style.display = 'block';
    document.getElementById('salaIdDisplay').textContent = tuSalaId;
    document.getElementById('menuButton').style.display = 'block';
    
    console.log(`Intentando crear la sala con ID: ${tuSalaId}`);
});

socket.on('sala-creada', estadoJuego => {
    console.log('Estado del juego recibido:', estadoJuego);
    actualizarJuego(estadoJuego);
    document.getElementById('adivinarLetraInfo').style.display = 'block';
});

const botonUnirseSala = document.getElementById('unirseSala');
const inputSalaId = document.getElementById('salaIdInput');

botonUnirseSala.addEventListener('click', () => {
    if (!playerName) {
        alert('Por favor, introduce tu nombre primero.');
        return;
    }
    let salaId = inputSalaId.value.trim();
    if (salaId) {
        socket.emit('unirse-juego', { salaId: salaId, playerName: playerName });
        tuSalaId = salaId;
        console.log(`Intentando unirse a la sala con ID: ${salaId}`);
        document.querySelector('.input-group-join').style.display = 'none';
        document.getElementById('salaInfo').style.display = 'block';
        document.getElementById('salaIdDisplay').textContent = tuSalaId;
        document.getElementById('menuButton').style.display = 'block';
        document.getElementById('adivinarLetraInfo').style.display = 'block';
    } else {
        console.log('Por favor, ingresa un ID de sala válido.');
    }
});


const showWinMessage = () => {
    document.getElementById('winMessage').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none'; 
};

const showLoseMessage = (correctWord) => {
    document.getElementById('correctWord').textContent = correctWord;
    document.getElementById('loseMessage').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none'; 
};

function showPostGameOptions() {
    postGameOptions.style.display = 'block';

    if (esAnfitrion) {
        restartButton.style.display = 'block';
    } else {
        restartButton.style.display = 'none';
    }
    
}

menuButtonPostGame.addEventListener('click', () => {
    window.location.reload();
});

menuButton.addEventListener('click', () => {
    window.location.reload();
});

restartButton.addEventListener('click', () => {
    socket.emit('iniciar-nueva-partida', { salaId: tuSalaId });
    postGameOptions.style.display = 'none';
});


function actualizarJuego(estadoJuego) {

    if (typeof estadoJuego.palabra === 'string') {
        selectedWord = estadoJuego.palabra.split('');
    } else {
        console.error('Palabra recibida no es una cadena:', estadoJuego.palabra);
        selectedWord = [];
    }
    
    console.log('Estado del juego recibido:', estadoJuego);

    usedLetters = estadoJuego.letrasUsadas;
    mistakes = estadoJuego.errores;
    hits = estadoJuego.aciertos;

    usedLettersElement.innerHTML = '';
    estadoJuego.letrasUsadas.forEach(letra => addLetter(letra));

    drawWord();
    drawHangMan(); 

    for (let i = 0; i < mistakes; i++) {
        addBodyPart(bodyParts[i]);
    }

    startButton.style.display = 'none';
    document.addEventListener('keydown', letterEvent);

    const uniqueLettersInWord = [...new Set(selectedWord)];
    const hasWon = uniqueLettersInWord.every(letter => usedLetters.includes(letter));
    const hasLost = mistakes >= bodyParts.length;
    setTimeout(() => {
        if (hasWon) {
            showWinMessage();
            showPostGameOptions();
        } else if (hasLost) {
            showLoseMessage(selectedWord.join(''));
            showPostGameOptions();
        }
    }, 0);
}

socket.on('estado-actual', estadoJuego => {
    esAnfitrion = estadoJuego.esAnfitrion;
    console.log("Es anfitrión:", esAnfitrion);
    actualizarJuego(estadoJuego);
    drawWord();
});