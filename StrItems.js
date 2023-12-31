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
        description: '+ Freq \n You start to get \n hang of it', 
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
        description: ' + Duration \n Filled to \n the brim',
        type: 'UPGRADE',
        upgradeElement:  {
            idToUpgrade: 3,
            valueToIncrement: "duration",
            increment: 250
        },
        idSprite: undefined,
        listPrereq: [3] 
    },
    { 
        id: 5, 
        name: 'Whip ++', 
        description: '+ Quant \n Where did you \n find another one?', 
        type: 'UPGRADE',
        upgradeElement:  {
            idToUpgrade: 1,
            valueToIncrement: "quantity",
            increment: 1
        },
        idSprite: undefined, 
        listPrereq: [1,2] 
    },   
    { 
        id: 6, 
        name: 'Magic Wand +', 
        description: '\n', 
        type: 'UPGRADE',
        upgradeElement:  {
            idToUpgrade: 0,
            valueToIncrement: "freq",
            increment: -200
        },
        idSprite: undefined, 
        listPrereq: [0] 
    },
    { 
        id: 7, 
        name: 'Light from above', 
        description: 'The sky keeps \n calling my name', 
        type: 'PROJECTILE',
        idSprite: 'ID_SPR_LIGHT', 
        listPrereq: [] 
    },
    { 
        id: 8, 
        name: 'Fire stick', 
        description: 'The sweet warm \n of the common fire', 
        type: 'PROJECTILE',
        idSprite: 'ID_SPR_FIRE', 
        listPrereq: [] 
    },
    { 
        id: 9, 
        name: 'Fire stick +', 
        description: '+ Quant \n More fire \n per fire', 
        upgradeElement:  {
            idToUpgrade: 8,
            valueToIncrement: "quantity",
            increment: 2
        },
        idSprite: undefined, 
        listPrereq: [8] 
    }, 
    { 
        id: 10, 
        name: 'Fire Potion ++', 
        description: ' + Quant \n Locked and \n loaded',
        type: 'UPGRADE',
        upgradeElement:  {
            idToUpgrade: 3,
            valueToIncrement: "quantity",
            increment: 1
        },
        idSprite: undefined,
        listPrereq: [3] 
    },
    { 
        id: 11, 
        name: 'Magic Wand ++', 
        description: '+ Freq \n Magic powered \n sub-machine', 
        type: 'UPGRADE',
        upgradeElement:  {
            idToUpgrade: 0,
            valueToIncrement: "freq",
            increment: -500
        },
        idSprite: undefined, 
        listPrereq: [0,6] 
    },
    { 
        id: 12, 
        name: 'Light from above', 
        description: '+ Quant \n The thunder \n is getting louder', 
        type: 'UPGRADE',
        upgradeElement:  {
            idToUpgrade: 7,
            valueToIncrement: "quantity",
            increment: 2
        },
        idSprite: undefined, 
        listPrereq: [7] 
    }
];