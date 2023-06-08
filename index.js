<<<<<<< HEAD
const fs = require('fs');
const R = require('ramda');
=======
const resultList = [
    {number_bib: '1234', gender: 'M', result: '1:34.2', country:'kenya', age : '20'},
    {number_bib: '1235', gender: 'F', result: '1:37.2', country:'france', age : '370'},
    {number_bib: '1239', gender: 'M', result: '1:42.2', country:'usa',age : '18'},
    {number_bib: '1237', gender: 'F', result: '2:34.5', country:'france', age : '60'},
    {number_bib: '1232', gender: 'F', result: '3:13.2', country:'kenya', age : '50'},
    {number_bib: '1238', gender: 'M', result: '0:13.2', country:'france', age : '99'}
    {number_bib: '1999', gender: 'F', result: '1:15.1', country:'usa', age : '46'}
];
>>>>>>> 169ee34f32ed99381c7d35320f412980bcdc2bc9

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