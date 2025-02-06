import { Tile } from './tile';

export interface Map {
    id: number;
    name: string;
    readonly size: number;
    isVisible: boolean;
    description: string;
    gameMode: 'CTF' | 'Classic';
    tileMatrix: Tile[][];
    lastModified: Date;
    previewImage?: string;
}
