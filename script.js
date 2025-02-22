const IMAGE_FOLDER = "image générateur/personnage/";
const CHARACTERS = ["sans", "papyrus", "undyne", "toriel", "asgore", ];

function loadCharacterImages() {
    const characterSelect = document.getElementById('character-select');
    CHARACTERS.forEach(character => {
        const img = document.createElement('img');
        img.src = `${IMAGE_FOLDER}${character}_neutral_determination.png`;
        img.alt = character;
        img.dataset.character = character;
        img.addEventListener('click', () => selectCharacter(character));
        characterSelect.appendChild(img);
    });
}

function selectCharacter(character) {
    const images = document.querySelectorAll('#character-select img');
    images.forEach(img => {
        if (img.dataset.character === character) {
            img.classList.add('selected');
        } else {
            img.classList.remove('selected');
        }
    });
    document.getElementById('character').value = character;
    drawDialogueBox();
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            console.log("Image chargée avec succès:", src); 
            resolve(img);
        };
        img.onerror = () => {
            console.error(`Erreur de chargement de l'image: ${src}`); 
            reject(new Error(`Erreur de chargement de l'image: ${src}`));
        };
        img.src = src;
    });
}

function createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function getInputValues() {
    const character = document.getElementById('character').value;
    const font = character === "papyrus" ? "Papyrus" : document.getElementById('font').value;

    return {
        text: document.getElementById('text').value,
        font: font,
        character: character,
        expression: document.getElementById('expression').value,
        textColor: document.getElementById('text-color').value,
        boxColor: document.getElementById('box-color').value
    };
}

async function drawDialogueBox() {
    const { text, font, character, expression, textColor, boxColor } = getInputValues();

    try {
        const imagePath = `${IMAGE_FOLDER}${character}_${expression}_${font.replace(/\s+/g, '').toLowerCase()}.png`;
        console.log("Tentative de chargement de l'image:", imagePath); 

        const characterImg = await loadImage(imagePath);
        const canvas = createCanvas(600, 200);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = boxColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const charWidth = canvas.width * 0.2;
        const charHeight = charWidth * (characterImg.height / characterImg.width);
        ctx.drawImage(characterImg, canvas.width * 0.05, canvas.height * 0.1, charWidth, charHeight);

        ctx.font = `${canvas.width * 0.04}px ${font}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        wrapText(ctx, text, canvas.width * 0.3, canvas.height * 0.1, canvas.width * 0.65, canvas.height * 0.08);

        displayCanvas(canvas);
    } catch (error) {
        console.error("Erreur lors de la génération de la boîte de dialogue:", error);
        alert("Une erreur s'est produite lors de la génération de la boîte de dialogue.");
    }
}

function displayCanvas(canvas) {
    const container = document.getElementById('preview-container');
    container.innerHTML = '';
    container.appendChild(canvas);
    document.getElementById('download-button').style.display = 'block';
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const lines = text.split('\n');
    lines.forEach((line, index) => {
        ctx.fillText(line, x, y + index * lineHeight);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCharacterImages();
    document.getElementById('expression').addEventListener('change', drawDialogueBox);
    document.getElementById('font').addEventListener('change', drawDialogueBox);
    document.getElementById('text').addEventListener('input', drawDialogueBox);
    document.getElementById('text-color').addEventListener('change', drawDialogueBox);
    document.getElementById('box-color').addEventListener('change', drawDialogueBox);
});