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



// Utiliser le tableau resultList ou effectuer d'autres opérations avec les données
//console.log(resultList);



// Vérification de l'unicité des numéros de dossard
/*const numberBibs = resultList.map(participant => participant.number_bib);
const isUnique = numberBibs.length === new Set(numberBibs).size;

console.log("Les number_bib sont uniques :", isUnique);*/



// Mélanger le tableau resultList de manière aléatoire
let shuffledResultList = resultList.sort(() => Math.random() - 0.5);


const resultList2 = [
    {number_bib: '1234', gender: 'M', result: '1:34.2', country:'kenya' , age : '20'},
    {number_bib: '1235', gender: 'F', result: '1:37.2',country:'kenya' ,age : '20'},
    {number_bib: '1239', gender: 'M', result: '1:42.2',country:'kenya' ,age : '20'},
    {number_bib: '1237', gender: 'F', result: '2:34.5',country:'kenya', age : '20'},
    {number_bib: '1232', gender: 'F', result: '3:13.2',country:'kenya' ,age : '40'},
    {number_bib: '1999', gender: 'F', result: '1:15.1',country:'kenya', age : '30'}
];

console.log(getRankingWomen(shuffledResultList));

// Dans toutes les fonctions de ranking, on prend les 5 premiers éléments de la liste, si on veut changer
// ce nombre, on doit remplacer 5 par le nombre d'éléments que l'on veut prendre dans la fonction R.take()
// de chaque fonction de ranking.