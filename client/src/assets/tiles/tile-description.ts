import { TileTypes } from '@common/tileType.constants';

export const tileDescription: { [key: string]: { name: string; description: string } } = {
    [TileTypes.GROUND_0]: {
        name: '❄️ Glace',
        description: 'Une surface glacée lisse et brillante. **Coût de marche : 0** - Glissez comme sur une banane !',
    },
    [TileTypes.GROUND_1]: {
        name: '🌱 Terre',
        description: 'Un sol naturel et robuste. **Coût de marche : 1** - Parfait pour une promenade tranquille.',
    },
    [TileTypes.GROUND_2]: {
        name: '💧 Eau',
        description: "Une étendue d'eau claire et rafraîchissante. **Coût de marche : 2** - Attention, ça mouille !",
    },
    [TileTypes.WALL]: {
        name: '🧱 Mur de pierre',
        description: 'Un mur solide et imposant. **Impenetrable** - Même les plus forts ne peuvent le traverser.',
    },
    [TileTypes.DOOR]: {
        name: '🚪 Porte',
        description: "Une porte mystérieuse. **Change d'état** en repeignant dessus - Qui sait ce qu'elle cache ?",
    },
    [TileTypes.OPEN_DOOR]: { name: 'Open Door', description: 'Porte ouverte' },
};
