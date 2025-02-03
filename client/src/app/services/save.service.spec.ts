import { TestBed } from '@angular/core/testing';
import { SaveService } from '@app/services/save.service';

// import { GameObject } from '@common/gameObject.interface';
import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
// import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';

const MAP_SIZE_SMALL = 10;
const MAP_SIZE_MEDIUM = 15;
const MAP_SIZE_LARGE = 20;

fdescribe('SaveService', () => {
    let service: SaveService;
    const mockMap = new Map('Untitled', MAP_SIZE_SMALL, true, '', 'Classic');

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(SaveService);
        mockMap.name = 'Untitled';
        mockMap.isVisible = true;
        mockMap.description = 'blblabla';
        mockMap.gameMode = 'Classic';
        for (let i = 0; i < MAP_SIZE_SMALL; i++) {
            for (let j = 0; j < MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j].type = TileTypes.GROUND_0;
                if (mockMap.tileMatrix[i][j].gameObject) {
                    mockMap.tileMatrix[i][j].gameObject = null;
                }
            }
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should check if name is unique', () => {
        service.setGameNames([{ name: 'test' }]);
        expect(service.isUniqueName('test')).toBeFalse();
        expect(service.isUniqueName('test2')).toBeTrue();
    });

    it('should check if map has description and name', () => {
        // set up valid map
        mockMap.tileMatrix[0][0].gameObject = new ItemObject('spawnpoint');
        mockMap.tileMatrix[0][1].gameObject = new ItemObject('spawnpoint');

        mockMap.name = '';
        expect(service.validateGame(mockMap)).toEqual(['Le nom du jeu ne peut pas etre vide.']);
        mockMap.name = 'oiiei';

        mockMap.description = '';
        expect(service.validateGame(mockMap)).toEqual(['La description du jeu ne peut pas etre vide.']);
    });

    it('should check if map is half floor', () => {
        expect(service.isMapHalfFloor(mockMap)).toBeTrue();
        for (let i = 0; i < MAP_SIZE_SMALL / 2; i++) {
            for (let j = 0; j < MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j].type = TileTypes.WALL;
            }
        }
        expect(service.isMapHalfFloor(mockMap)).toBeFalse();
        mockMap.tileMatrix[0][0].type = TileTypes.GROUND_0;
        expect(service.isMapHalfFloor(mockMap)).toBeTrue();
        mockMap.tileMatrix[0][0].type = TileTypes.DOOR;
        expect(service.isMapHalfFloor(mockMap)).toBeFalse();

        for (let i = MAP_SIZE_SMALL / 2; i < MAP_SIZE_SMALL; i++) {
            for (let j = 0; j < MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j].type = TileTypes.WALL;
            }
        }
        expect(service.isMapHalfFloor(mockMap)).toBeFalse();
    });

    it('should check if map is accessible', () => {
        mockMap.tileMatrix[0][1].type = TileTypes.WALL;
        mockMap.tileMatrix[1][1].type = TileTypes.WALL;
        mockMap.tileMatrix[1][0].type = TileTypes.WALL;
        expect(service.isMapAccessible(mockMap)).toBeFalse();
        mockMap.tileMatrix[1][1].type = TileTypes.GROUND_0;
        expect(service.isMapAccessible(mockMap)).toBeFalse();
        mockMap.tileMatrix[0][0].type = TileTypes.WALL;
        expect(service.isMapAccessible(mockMap)).toBeTrue();

        for (let i = 0; i < MAP_SIZE_SMALL; i++) {
            mockMap.tileMatrix[i][4].type = TileTypes.WALL;
        }
        expect(service.isMapAccessible(mockMap)).toBeFalse();
    });

    it('should check if starting points are placed', () => {
        // for 10x10 map
        expect(service.areStartingPointsValid(mockMap)).toBeFalse();
        mockMap.tileMatrix[0][0].gameObject = new ItemObject('spawnpoint');
        mockMap.tileMatrix[0][1].gameObject = new ItemObject('spawnpoint');
        expect(service.areStartingPointsValid(mockMap)).toBeTrue();

        // 15x15 map
        const mockMap15 = new Map('Map by 15', MAP_SIZE_MEDIUM, true, '', 'Classic');
        expect(service.areStartingPointsValid(mockMap15)).toBeFalse();
        mockMap15.tileMatrix[0][0].gameObject = new ItemObject('spawnpoint');
        mockMap15.tileMatrix[0][1].gameObject = new ItemObject('spawnpoint');
        expect(service.areStartingPointsValid(mockMap15)).toBeFalse();
        mockMap15.tileMatrix[0][2].gameObject = new ItemObject('spawnpoint');
        mockMap15.tileMatrix[0][3].gameObject = new ItemObject('spawnpoint');
        expect(service.areStartingPointsValid(mockMap15)).toBeTrue();

        // 20x20 map
        const mockMap20 = new Map('Map by 20', MAP_SIZE_LARGE, true, '', 'Classic');
        mockMap20.tileMatrix[0][0].gameObject = new ItemObject('spawnpoint');
        mockMap20.tileMatrix[0][1].gameObject = new ItemObject('spawnpoint');
        mockMap20.tileMatrix[0][2].gameObject = new ItemObject('spawnpoint');
        mockMap20.tileMatrix[0][3].gameObject = new ItemObject('spawnpoint');
        mockMap20.tileMatrix[0][4].gameObject = new ItemObject('spawnpoint');
        expect(service.areStartingPointsValid(mockMap20)).toBeFalse();
        mockMap20.tileMatrix[0][5].gameObject = new ItemObject('spawnpoint');
        expect(service.areStartingPointsValid(mockMap20)).toBeTrue();
    });

    it('should check if doors are between walls', () => {
        mockMap.tileMatrix[5][5].type = TileTypes.DOOR;
        expect(service.areDoorsNextToWalls(mockMap)).toBeFalse();

        mockMap.tileMatrix[4][5].type = TileTypes.WALL;
        expect(service.areDoorsNextToWalls(mockMap)).toBeFalse();

        mockMap.tileMatrix[6][5].type = TileTypes.WALL;
        expect(service.areDoorsNextToWalls(mockMap)).toBeTrue();

        mockMap.tileMatrix[5][4].type = TileTypes.WALL;
        expect(service.areDoorsNextToWalls(mockMap)).toBeFalse();
    });

    it('should check if walls are not next to the border', () => {
        mockMap.tileMatrix[0][0].type = TileTypes.DOOR;
        expect(service.areDoorsNotNextToBorder(mockMap)).toBeFalse();

        mockMap.tileMatrix[0][0].type = TileTypes.GROUND_0;
        expect(service.areDoorsNotNextToBorder(mockMap)).toBeTrue();

        mockMap.tileMatrix[0][1].type = TileTypes.DOOR;
        expect(service.areDoorsNotNextToBorder(mockMap)).toBeFalse();

        mockMap.tileMatrix[0][1].type = TileTypes.WALL;
        mockMap.tileMatrix[5][MAP_SIZE_SMALL - 1].type = TileTypes.DOOR;
        expect(service.areDoorsNotNextToBorder(mockMap)).toBeFalse();
    });

    it('should show the correct error message', () => {
        mockMap.name = '';
        expect(service.validateGame(mockMap)).toEqual(['Le nom du jeu ne peut pas etre vide.', 'Tous les points de départ doivent etre placés.']);

        // triggers isUniqueName
        mockMap.name = 'test';

        // triggers isMapHalfFloor
        for (let i = 0; i < MAP_SIZE_SMALL / 2; i++) {
            for (let j = 0; j < MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j].type = TileTypes.WALL;
            }
        }

        // triggers isMapAccessible
        mockMap.tileMatrix[MAP_SIZE_SMALL - 1][1].type = TileTypes.WALL;
        mockMap.tileMatrix[MAP_SIZE_SMALL - 2][0].type = TileTypes.WALL;

        // triggers areDoorsNotNextToBorder
        mockMap.tileMatrix[MAP_SIZE_SMALL - 1][5].type = TileTypes.DOOR;
        // triggers areDoorsNextToWalls
        mockMap.tileMatrix[1][8].type = TileTypes.DOOR;

        mockMap.tileMatrix[8][8].gameObject = new ItemObject('spawnpoint');
        mockMap.tileMatrix[8][9].gameObject = new ItemObject('spawnpoint');

        expect(service.validateGame(mockMap)).toEqual([
            'Le nom du jeu doit etre unique.',
            'Plus de 50% de la surface totale de la zone de jeu doit être occupée par des tuiles de terrain.',
            "Aucune tuile de terrain ne doit être inaccessible à cause d'un agencement de murs.",
            'Chaque tuile de porte doit se trouver entre deux tuiles de mur sur un même axe.',
            'Une porte ne peut pas être placée sur les bords de la zone de jeu.',
        ]);
    });
});
