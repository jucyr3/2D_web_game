import { MapProperties } from '@common/map.constants';

export interface MapFormData {
    gameMode: 'Classic' | 'CTF';
    size: MapProperties.MAP_SIZE_SMALL | MapProperties.MAP_SIZE_MEDIUM | MapProperties.MAP_SIZE_LARGE;
}
