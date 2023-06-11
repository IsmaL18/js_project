const fs = require('fs');
const R = require('ramda');

const filePath = 'Dataset-Boston-2019.csv';


// Lecture du fichier

const data = fs.readFileSync(filePath, 'utf8');

// Convertir le CSV en tableau d'objets
const rows = data.split('\n');
const headers = rows[0].split(',');
const dataset = rows.slice(1).map(row => {
    const values = row.split(',');
    if (values.length === headers.length) {
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
        }, {});
    }
}).filter(Boolean);

// Générer un numéro de dossard aléatoire pour chaque participant
const totalParticipants = dataset.length;
const datasetWithRandomNumberBib = dataset.map(participant => {
    participant.number_bib = Math.floor(Math.random() * totalParticipants) + 1;
    return participant;
});

// Générer un tableau d'indices uniques
const indices = Array.from(Array(totalParticipants).keys());

// Mélanger les indices de manière aléatoire
for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
}

// Attribuer les number_bib uniques aux participants
const datasetWithUniqueNumberBib = datasetWithRandomNumberBib.map((participant, index) => {
    participant.number_bib = indices[index] + 1;
    return participant;
});

// Créer le tableau resultList avec les propriétés spécifiées, y compris number_bib
const resultList = datasetWithUniqueNumberBib.map(participant => {
    return {
        gender: participant.Gender,
        result_hr: participant.Result_hr,
        country: participant.Country,
        age: participant.Age,
        number_bib: participant.number_bib
    };
});



// Utiliser le tableau resultList ou effectuer d'autres opérations avec les données
console.log(resultList);


const numberBibs = resultList.map(participant => participant.number_bib);
const isUnique = numberBibs.length === new Set(numberBibs).size;

console.log("Les number_bib sont uniques :", isUnique);
// Mélanger le tableau resultList de manière aléatoire
let shuffledResultList = resultList.sort(() => Math.random() - 0.5);

console.log(shuffledResultList);