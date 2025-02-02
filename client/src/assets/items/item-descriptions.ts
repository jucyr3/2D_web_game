// constants.ts
interface ItemDescription {
    name: string;
    description: string;
}

export const itemDescriptions: { [key: string]: ItemDescription } = {
    // Objets qui modifient les attributs
    attributeItem1: {
        name: "Objet d'Attribut 1",
        description: "Modifie les attributs du joueur ou de l'adversaire (ex.: augmente ou réduit un attribut).",
    },
    attributeItem2: {
        name: "Objet d'Attribut 2",
        description: "Modifie les attributs du joueur ou de l'adversaire (ex.: augmente ou réduit un attribut).",
    },

    // Objets utilisant une condition
    conditionItem1: {
        name: 'Objet de Condition 1',
        description: "Active un effet uniquement lorsqu'une condition spécifique est remplie (ex.: faible santé ou proximité avec un adversaire).",
    },
    conditionItem2: {
        name: 'Objet de Condition 2',
        description: "Active un effet uniquement lorsqu'une condition spécifique est remplie (ex.: faible santé ou proximité avec un adversaire).",
    },

    // Objets qui modifient le fonctionnement du jeu
    gameplayItem1: {
        name: 'Objet de Gameplay 1',
        description: 'Modifie le fonctionnement du jeu (ex.: ralentit la vitesse du jeu ou change les règles de déplacement).',
    },
    gameplayItem2: {
        name: 'Objet de Gameplay 2',
        description: 'Modifie le fonctionnement du jeu (ex.: ralentit la vitesse du jeu ou change les règles de déplacement).',
    },

    // Objets spéciaux (conservés tels quels)
    spawnpoint: {
        name: "Point d'Apparition",
        description: "Ceci est l'objet point d'apparition.",
    },
    flag: {
        name: 'Drapeau',
        description: "Ceci est l'objet drapeau.",
    },
    randomItem: {
        name: 'Objet Aléatoire',
        description: 'Se transforme en un objet aléatoire au lancement du jeu.',
    },
};
