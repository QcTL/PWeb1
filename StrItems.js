const dataArray = [
    { 
        id: 0, 
        name: 'Magic Wand', 
        description: '\n', 
        type: 'PROJECTILE',
        idSprite: 'ID_SPR_WAND',
        listPrereq: [] 
    },
    { 
        id: 1, 
        name: 'Whip', 
        description: 'Made with an \n extrange black hair', 
        type: 'PROJECTILE',
        idSprite: 'ID_SPR_WHIP',
        listPrereq: [] 
    },
    { 
        id: 2, 
        name: 'Whip +', 
        description: 'The oddor is \n more potent', 
        type: 'UPGRADE',
        upgradeElement:  {
            idToUpgrade: 1,
            valueToIncrement: "freq",
            increment: -200
        },
        idSprite: undefined, 
        listPrereq: [1] 
    },
    { 
        id: 3, 
        name: 'Fire Potion', 
        description: 'Inflammable means \n flammable!?!', 
        type: 'PROJECTILE',
        idSprite: 'ID_SPR_SPLASH', 
        listPrereq: [] 
    },
    { 
        id: 4, 
        name: 'Fire Potion +', 
        description: 'Filled to \n the brim',
        type: 'UPGRADE',
        upgradeElement:  {
            idToUpgrade: 3,
            valueToIncrement: "duration",
            increment: 250
        },
        idSprite: undefined,
        listPrereq: [3] 
    },

];

export {dataArray};