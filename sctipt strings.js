// Sélection des éléments du DOM
const stringsBody = document.getElementById('strings-body');
const searchInput = document.getElementById('search-input');

// Chemin relatif vers le fichier Excel
const excelFilePath = 'string excel.xlsx'; // Chemin relatif à la racine du projet

// Fonction pour charger et lire le fichier Excel
async function loadExcelFile() {
    try {
        console.log("Tentative de chargement du fichier Excel...");
        const response = await fetch(excelFilePath);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        console.log("Fichier Excel chargé avec succès !");

        // Utilisation de SheetJS pour lire le fichier Excel
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        console.log("Fichier Excel analysé avec succès !");

        // Supposons que le fichier Excel a une seule feuille
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        console.log("Feuille trouvée :", sheetName);

        // Extraire les données brutes sous forme de tableau
        const range = XLSX.utils.decode_range(sheet['!ref']);
        const rows = [];
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
            const row = [];
            for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
                const cell = sheet[cellAddress];
                row.push(cell ? cell.v : ''); // Ajouter la valeur de la cellule ou une chaîne vide si la cellule est vide
            }
            rows.push(row);
        }

        console.log("Données extraites :", rows);

        // Générer le tableau HTML
        generateStringsTable(rows);
    } catch (error) {
        console.error("Erreur lors du chargement du fichier Excel :", error);
    }
}

// Générer le tableau à partir des données Excel
function generateStringsTable(data) {
    console.log("Données reçues pour générer le tableau :", data);
    stringsBody.innerHTML = "";
    data.forEach((row) => {
        const [french, english] = row;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${french || ''}</td>
            <td>${english || ''}</td>
        `;
        stringsBody.appendChild(tr);
    });
}

// Fonction de recherche
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = stringsBody.querySelectorAll('tr');

    rows.forEach(row => {
        const french = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        const english = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

        if (french.includes(searchTerm) || english.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Fonction de tri
function sortTable(columnIndex) {
    const rows = Array.from(stringsBody.querySelectorAll('tr'));
    const isAscending = stringsBody.getAttribute('data-sort') === 'asc';

    rows.sort((a, b) => {
        const aValue = a.querySelectorAll('td')[columnIndex].textContent;
        const bValue = b.querySelectorAll('td')[columnIndex].textContent;
        return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    stringsBody.setAttribute('data-sort', isAscending ? 'desc' : 'asc');
    stringsBody.innerHTML = '';
    rows.forEach(row => stringsBody.appendChild(row));
}

// Charger le fichier Excel au chargement de la page
window.onload = loadExcelFile;