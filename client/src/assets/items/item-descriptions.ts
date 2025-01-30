// constants.ts
interface Item {
    name: string;
    description: string;
  }
  
export const ITEMS: { [key: string]: Item } = {
    // Items that alter attributes
    ATTRIBUTE_ITEM_1: {
        name: 'Attribute Item 1',
        description: 'Alters player or opponent attributes (e.g., increases strength or decreases speed).',
    },
    ATTRIBUTE_ITEM_2: {
        name: 'Attribute Item 2',
        description: 'Alters player or opponent attributes (e.g., boosts defense or reduces attack power).',
    },

    // Items that use a condition
    CONDITION_ITEM_1: {
        name: 'Condition Item 1',
        description: 'Activates an effect only when a specific condition is met (e.g., low health or proximity to an opponent).',
    },
    CONDITION_ITEM_2: {
        name: 'Condition Item 2',
        description: 'Triggers an effect based on a specific condition (e.g., after a certain number of turns or actions).',
    },

    // Items that modify the game's functionality
    GAMEPLAY_ITEM_1: {
        name: 'Gameplay Item 1',
        description: 'Modifies the game\'s functionality (e.g., slows down the game speed or changes movement rules).',
    },
    GAMEPLAY_ITEM_2: {
        name: 'Gameplay Item 2',
        description: 'Modifies the game\'s functionality (e.g., reverses controls or alters win conditions).',
    },

    // Special items (kept intact)
    spawnpoint: {
        name: 'Spawnpoint',
        description: 'This is the spawnpoint item.',
    },
    flag: {
        name: 'Flag',
        description: 'This is the flag item.',
    },
    randomItem: {
        name: 'Random Item',
        description: 'This is the randomItem.',
    },
};