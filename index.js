const fs = require('fs');
const R = require('ramda');

const filePath = 'Dataset-Boston-2019.csv';

const stringToTimeInMinutes = (s) => {
    const [hour, min] = s.split(':');
    return Number(hour) * 60 + Number(min);
};

const getSortedList = R.pipe (
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
    R.head(10)
);
// exemple d'utilisation: getRankingMen(resultList)

const getRankingWomen = R.pipe(
    R.filter(x => x.gender === 'F'),
    getSortedList,
    R.head(10)
);
// exemple d'utilisation:

const getRankingByAge = (minAge, maxAge) => R.pipe(
    R.filter(R.both((x => minAge <= parseInt(x.age)),(x => parseInt(x.age) <= maxAge))),
    getSortedList,
    R.head(10)
);
// exemple d'utilisation: getRankingByCountry('kenya')(resultList)

const getRankingByCountry = (country) => R.pipe(
    R.filter(x => x.country === country),
    getSortedList,
    R.head(10)
);
// exemple d'utilisation: getRankingByAge(0, 20)(resultList) renvoie le classement des participants qui ont entre 0 et 20 ans


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
            gender: participant.Gender,
            result_hr: participant.Result_hr,
            country: participant.Country,
            age: participant.Age,
            number_bib: participant.number_bib
        };
    });
});
