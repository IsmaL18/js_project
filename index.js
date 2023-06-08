const fs = require('fs');
const R = require('ramda');

const filePath = 'C:/Users/hanif/OneDrive/Bureau/JAVASCRIPT/js_project/Dataset-Boston-2019.csv';

fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
        console.error('Une erreur s\'est produite lors du chargement du dataset :', error);
        return;
    }

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

    // Créer le tableau resultList avec les propriétés spécifiées, y compris number_bib
    const resultList = datasetWithRandomNumberBib.map(participant => {
        return {
            Gender: participant.Gender,
            Result_hr: participant.Result_hr,
            Country: participant.Country,
            Age: participant.Age,
            number_bib: participant.number_bib
        };
    });

    // Afficher le resultList
    console.log(resultList);
});


//const filePath = 'C:/Users/hanif/OneDrive/Bureau/JAVASCRIPT/js_project/Dataset-Boston-2019.csv';