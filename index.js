const readlineSync = require('readline-sync');
const fs = require('fs');
const R = require('ramda');



const filePath = 'Dataset-Boston-2019.csv';


// Création des fonctions de ranking
const stringToTimeInMinutes = (s) => {
    const [hour, min] = s.split(':');
    return Number(hour) * 60 + Number(min);
};

const getSortedList = R.pipe(
    R.map(
        R.when(
            R.has('result'),
            R.over(R.lensProp('result'), stringToTimeInMinutes)
        )
    ),
    R.sortBy(R.prop('result'))
);

const getRankingMen = R.pipe(
    R.filter(x => x.gender === 'M'),
    getSortedList,
    R.take(5)
);
// exemple d'utilisation: getRankingMen(resultList)

const getRankingWomen = R.pipe(
    R.filter(x => x.gender === 'F'),
    getSortedList,
    R.take(5)
);
// exemple d'utilisation: getRankingWomen(resultList)

const getRankingByAge = (minAge, maxAge) => R.pipe(
    R.filter(R.both((x => minAge <= parseInt(x.age)), (x => parseInt(x.age) <= maxAge))),
    getSortedList,
    R.take(5)
);
// exemple d'utilisation: getRankingByCountry('kenya')(resultList)

const getRankingByCountry = (country) => R.pipe(
    R.filter(x => x.country === country),
    getSortedList,
    R.take(5)
);
// exemple d'utilisation: getRankingByAge(0, 20)(resultList) renvoie le classement des participants qui ont entre 0 et 20 ans



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
};

// Attribuer les number_bib uniques aux participants
const datasetWithUniqueNumberBib = datasetWithRandomNumberBib.map((participant, index) => {
    participant.number_bib = indices[index] + 1;
    return participant;
});

// Créer le tableau resultList avec les propriétés spécifiées, y compris number_bib
const resultList = datasetWithUniqueNumberBib.map(participant => {
    return {
        gender: participant.Gender,
        result: participant.Result_hr,
        country: participant.Country,
        age: participant.Age,
        number_bib: participant.number_bib
    };
});


// Mélanger le tableau resultList de manière aléatoire
let shuffledResultList = resultList.sort(() => Math.random() - 0.5);


// Interaction utilisateur pour obtenir le classement souhaité
const obtenirClassement = () => {
    const typeClassement = readlineSync.question('Quel type de classement souhaitez-vous ? (genre/age/pays): ');

    if (typeClassement === 'genre') {
        const genreDemande = readlineSync.question('Quel genre souhaitez-vous ? (homme/femme): ');
        if (genreDemande === 'homme'){
            console.log(getRankingMen(shuffledResultList))
        }
        else if (genreDemande === 'femme') {
            console.log(getRankingWomen(shuffledResultList))
        }
        else {
            console.log("Il y a un problème.")
        }
    } else if (typeClassement === 'age') {
        const ageInf = parseInt(readlineSync.question('Quel âge minimum souhaitez-vous ? : '));
        const ageSup = parseInt(readlineSync.question('Quel âge maximum souhaitez-vous ? : '));
        console.log(getRankingByAge(ageInf, ageSup)(shuffledResultList));
    } else if (typeClassement === 'pays') {
        const paysDemande = readlineSync.question('Entrez le pays souhaité : ');
        console.log(getRankingByCountry(paysDemande)(shuffledResultList));
    } else {
        console.log('Type de classement non reconnu.');
    }
};

obtenirClassement();