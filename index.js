const R = require('ramda');
const fs = require('fs');


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

const resultList2 = [
    {number_bib: '1234', gender: 'M', result: '1:34.2', country:'kenya', age : '20'},
    {number_bib: '1235', gender: 'F', result: '1:37.2', country:'france', age : '37'},
    {number_bib: '1239', gender: 'M', result: '1:42.2', country:'usa',age : '18'},
    {number_bib: '1237', gender: 'F', result: '2:34.5', country:'france', age : '60'},
    {number_bib: '1232', gender: 'F', result: '3:13.2', country:'kenya', age : '50'},
    {number_bib: '1238', gender: 'M', result: '0:13.2', country:'france', age : '99'},
    {number_bib: '1245', gender: 'M', result: '3:34.2', country:'kenya', age : '23'},
    {number_bib: '1257', gender: 'M', result: '1:55.2', country:'kenya', age : '35'},
    {number_bib: '1999', gender: 'F', result: '1:15.1', country:'usa', age : '46'}
];

// RANKING FUNCTIONS PART
/*
const bestTimeCandidate = R.pipe(
    R.sortBy(R.prop('result')),
    R.head,
    R.prop('number_bib')
)(resultList);

console.log("Voici le meilleur candidat : " + bestTimeCandidate);

const top3Candidates = R.pipe(
    R.sortBy(R.prop('result')),
    R.take(3),
    R.pluck('number_bib')
)(resultList);

console.log("Voici les 3 meilleurs candidats : " + top3Candidates.join(', '));

const worstTimeCandidate = R.pipe(
    R.sortBy(R.prop('result')),
    R.last,
    R.prop('number_bib')
)(resultList);

console.log("Voici le pire candidat : " + worstTimeCandidate);

const bottom3Candidates = R.pipe(
    R.sortBy(R.prop('result')),
    R.takeLast(3),
    R.pluck('number_bib')
)(resultList);

console.log("Voici les 3 pires candidats : " + bottom3Candidates.join(', '));

const rankingByGender = (resultList) => {
    const sortByResult = R.sortBy(R.prop('result'));

    const maleCandidates = R.pipe(
        R.filter(R.propEq('gender', 'M')),
        sortByResult
    )(resultList);

    const femaleCandidates = R.pipe(
        R.filter(R.propEq('gender', 'F')),
        sortByResult
    )(resultList);

    const ranking = {
        males: R.map(R.pick(['number_bib', 'gender', 'result', 'country']), maleCandidates),
        females: R.map(R.pick(['number_bib', 'gender', 'result', 'country']), femaleCandidates)
    };

    return ranking;
};
const rankingByGenderResult = rankingByGender(resultList);

console.log("Classement des meilleurs temps par genre :");
console.log("Males:");
rankingByGenderResult.males.forEach(candidate => {
    console.log(`Numéro bib: ${candidate.number_bib}, Genre: ${candidate.gender}, Temps: ${candidate.result}, Pays: ${candidate.country}`);
});

console.log("Females:");
rankingByGenderResult.females.forEach(candidate => {
    console.log(`Numéro bib: ${candidate.number_bib}, Genre: ${candidate.gender}, Temps: ${candidate.result}, Pays: ${candidate.country}`);
});

// Classement des meilleurs temps par pays (country)
const rankingByCountryResult = R.pipe(
    R.groupBy(R.prop('country')),
    R.mapObjIndexed((value, key) => ({
        country: key,
        candidates: R.sortBy(R.prop('result'), value)
    })),
    R.values
)(resultList);

console.log("Classement des meilleurs temps par pays :");
rankingByCountryResult.forEach((group) => {
    console.log(`Pays: ${group.country}`);
    group.candidates.forEach((candidate) => {
        console.log(`Numéro bib: ${candidate.number_bib}, Temps: ${candidate.result}`);
    });
    console.log("-------------------------");
});

// Classement des meilleurs temps par tranche d'âge
const rankingByAgeGroup = R.pipe(
    R.groupBy((candidate) => {
        const age = parseInt(candidate.age);
        if (age >= 0 && age <= 20) return '0-20 ans';
        if (age >= 21 && age <= 40) return '21-40 ans';
        if (age >= 41 && age <= 60) return '41-60 ans';
        if (age >= 61 && age <= 100) return '61-100 ans';
    }),
    R.mapObjIndexed((value, key) => ({
        ageGroup: key,
        candidates: R.sortBy(R.prop('result'), value)
    })),
    R.values
)(resultList);

console.log("Classement des meilleurs temps par tranche d'âge :");
rankingByAgeGroup.forEach((group) => {
    console.log(`Tranche d'âge: ${group.ageGroup}`);
    group.candidates.forEach((candidate) => {
        console.log(`Numéro bib: ${candidate.number_bib}, Temps: ${candidate.result}`);
    });
    console.log("-------------------------");
});

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Quel type de classement souhaitez-vous ? (pays / age / genre) ", (answer) => {
    if (answer === 'pays') {
        // Code pour afficher le classement par pays
        console.log("Classement des meilleurs temps par pays :");
        rankingByCountryResult.forEach((group) => {
            console.log(`Pays: ${group.country}`);
            group.candidates.forEach((candidate) => {
                console.log(`Numéro bib: ${candidate.number_bib}, Genre: ${candidate.gender}, Age: ${candidate.age},Temps: ${candidate.result}`);
            });
            console.log("-------------------------");
        });
    } else if (answer === 'age') {
        // Code pour afficher le classement par tranche d'âge
        console.log("Classement des meilleurs temps par tranche d'âge :");
        rankingByAgeGroup.forEach((group) => {
            console.log(`Tranche d'âge: ${group.ageGroup}`);
            group.candidates.forEach((candidate) => {
                console.log(`Numéro bib: ${candidate.number_bib}, Genre: ${candidate.gender}, Pays: ${candidate.country}, Temps: ${candidate.result}`);
            });
            console.log("-------------------------");
        });
    } else if (answer === 'genre') {
        // Code pour afficher le classement par tranche d'âge
        console.log("Vous avez choisi le classement par genre.");

    }else {
        console.log("Type de classement invalide.");
    }

    rl.close();
});


*/
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
    R.take(10) // Utilisez R.take pour obtenir les 10 premiers éléments
);




const getRankingWomen = R.pipe(
    R.filter(x => x.gender === 'F'),
    getSortedList,
    R.take(10)
);

// exemple d'utilisation:

const getRankingByAge = (minAge, maxAge) => R.pipe(
    R.filter(R.both((x => minAge <= parseInt(x.age)),(x => parseInt(x.age) <= maxAge))),
    getSortedList,
    R.take(10)
);
// exemple d'utilisation: getRankingByCountry('kenya')(resultList)

const getRankingByCountry = (country) => R.pipe(
    R.filter(x => x.country === country),
    getSortedList,
    R.take(10)
);
const readlineSync = require('readline-sync');



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

// Appel de la fonction obtenirClassement
obtenirClassement();
