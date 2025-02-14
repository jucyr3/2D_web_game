import { Tile } from '@common/tile';

export interface Map {
    mapId: string;
    name: string;
    readonly size: number;
    isVisible: boolean;
    description: string;
    gameMode: 'CTF' | 'Classic';
    tileMatrix: Tile[][];
    lastModified: Date;
    previewImage?: string;
}
