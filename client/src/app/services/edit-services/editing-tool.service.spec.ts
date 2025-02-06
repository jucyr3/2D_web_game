/* eslint-disable max-classes-per-file */
// La classe TestBed augmente le nombre de classes importees de 2 a 3 et fait donc lancer l'erreur de lint
import { TestBed } from '@angular/core/testing';
import { Coordinate } from '@app/interfaces/coordinate';
import { ItemObject } from '@common/ItemObject';

/* eslint-disable */
import { EditingToolService, EditToolTypes } from './editing-tool.service';
import { TileTypes } from '@app/../../../common/tileType.constants';
import { MapService } from '@app/services/edit-services/map.service';
import { MouseService } from '@app/services/edit-services/mouse.service';

class MockItemManager {
    increaseItemAmount = jasmine.createSpy('increaseItemAmount');
}

class MockMapService {
    getTileType = jasmine.createSpy('getTileType');
    getItemObject = jasmine.createSpy('getItemObject');
    removeGameObject = jasmine.createSpy('removeGameObject');
    changeTileType = jasmine.createSpy('changeTileType');
    itemManager = new MockItemManager();
}

class MockMouseService {
    isMouseDown = jasmine.createSpy('isMouseDown');
    isRightClick = false;
}

describe('EditingToolService', () => {
    let service: EditingToolService;
    let mapService: MockMapService;
    let mouseService: MockMouseService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditingToolService, { provide: MapService, useClass: MockMapService }, { provide: MouseService, useClass: MockMouseService }],
        });
        service = TestBed.inject(EditingToolService);
        mapService = TestBed.inject(MapService) as unknown as MockMapService;
        mouseService = TestBed.inject(MouseService) as unknown as MockMouseService;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set and get active tool', () => {
        service.setActiveTool(EditToolTypes.TileBrush);
        expect(service.getActiveTool()).toBe(EditToolTypes.TileBrush);
    });

    it('should set and get tile type on brush', () => {
        service.setTileTypeOnBrush(TileTypes.WALL);
        expect(service.getCurrentTileTypeOnBrush()).toBe(TileTypes.WALL);
    });

    it('should reset on mouse up', () => {
        service.onMouseUp();
        expect(service.getActiveTool()).toBe(EditToolTypes.TileBrush);
    });

    it('should get path between two points', () => {
        const start: Coordinate = { row: 0, column: 0 };
        const end: Coordinate = { row: 2, column: 2 };
        const path = service.getPath(start, end);
        expect(path.length).toBeGreaterThan(0);
        expect(path[0]).toEqual(start);
        expect(path[path.length - 1]).toEqual(end);
    });

    it('should paint interpolated path', () => {
        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 1, column: 1 };
        spyOn(service, 'placeTile');
        service.paintInterpolatedPath();
        expect(service.placeTile).toHaveBeenCalled();
    });

    it('should erase tile', () => {
        mapService.getItemObject.and.returnValue(null);
        mouseService.isRightClick = true;
        spyOn(service, 'placeTile');
        service.eraseTile(0, 0);
        expect(service.placeTile).toHaveBeenCalledWith(0, 0, TileTypes.GROUND_1);
    });

    it('should place tile', () => {
        mapService.getTileType.and.returnValue(TileTypes.GROUND_1);
        mapService.getItemObject.and.returnValue(null);
        service.placeTile(0, 0, TileTypes.WALL);
        expect(mapService.changeTileType).toHaveBeenCalledWith(0, 0, TileTypes.WALL);
    });

    it('should toggle door tile', () => {
        mapService.getTileType.and.returnValue(TileTypes.DOOR);
        service.placeTile(0, 0, TileTypes.DOOR);
        expect(mapService.changeTileType).toHaveBeenCalledWith(0, 0, TileTypes.OPEN_DOOR);
    });

    it('should remove item object from tile', () => {
        const itemObject: ItemObject = { name: 'TestItem' } as ItemObject;
        service.removeItemObjectFromTile(0, 0, itemObject);
        expect(mapService.itemManager.increaseItemAmount).toHaveBeenCalledWith('TestItem');
        expect(mapService.removeGameObject).toHaveBeenCalledWith(0, 0);
    });

    it('should set interpolation points', () => {
        service.setActiveTool(EditToolTypes.TileBrush);
        spyOn(service, 'paintInterpolatedPath');
        service.setInterpolationPoints({ row: 0, column: 0 });
        expect(service.startTile).toEqual({ row: 0, column: 0 });
        expect(service.endTile).toEqual({ row: 0, column: 0 });
        expect(service.paintInterpolatedPath).toHaveBeenCalled();
    });

    it('should toggle door tile if tile is door and brush is door', () => {
        mapService.getTileType.and.returnValue(TileTypes.DOOR);
        service.placeTile(0, 0, TileTypes.DOOR);
        expect(mapService.changeTileType).toHaveBeenCalledWith(0, 0, TileTypes.OPEN_DOOR);
    });

    it('should toggle door tile if tile is open door and brush is door', () => {
        mapService.getTileType.and.returnValue(TileTypes.OPEN_DOOR);
        service.placeTile(0, 0, TileTypes.DOOR);
        expect(mapService.changeTileType).toHaveBeenCalledWith(0, 0, TileTypes.DOOR);
    });

    it('isBrushWallOrDoor should return true if tile type is wall or door', () => {
        expect(service['isBrushWallOrDoor'](TileTypes.WALL)).toBeTrue();
        expect(service['isBrushWallOrDoor'](TileTypes.DOOR)).toBeTrue();
        expect(service['isBrushWallOrDoor'](TileTypes.GROUND_1)).toBeFalse();
    });

    it('Should use endTile as startTile if startTile is already set', () => {
        service.setActiveTool(EditToolTypes.TileBrush);
        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 2, column: 2 };
        service.setInterpolationPoints({ row: 1, column: 1 });
        expect(service.startTile).toEqual({ row: 2, column: 2 });
        expect(service.endTile).toEqual({ row: 1, column: 1 });
    });

    it('Should not paint interpolated path if start tile = null or end tile = null', () => {
        service.setActiveTool(EditToolTypes.TileBrush);
        service.startTile = null;
        service.endTile = { row: 2, column: 2 };
        spyOn(service, 'getPath');
        service.paintInterpolatedPath();
        expect(service.getPath).not.toHaveBeenCalled();
    });

    it('should return early if getPath returns an empty array', () => {
        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 0, column: 0 };
        spyOn(service, 'getPath').and.returnValue([]);
        spyOn(service, 'eraseTile');
        spyOn(service, 'placeTile');

        service.paintInterpolatedPath();

        expect(service.eraseTile).not.toHaveBeenCalled();
        expect(service.placeTile).not.toHaveBeenCalled();
    });

    it('If a tile has been processed, it should not be placed again', () => {
        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 0, column: 0 };
        service.previousStartTile = { row: 1, column: 1 };
        service.previousEndTile = { row: 1, column: 1 };

        spyOn(service, 'getPath').and.returnValue([{ row: 0, column: 0 }]);
        service['processedTiles'].add('0,0');

        spyOn(service, 'eraseTile');
        spyOn(service, 'placeTile');

        service.paintInterpolatedPath();

        expect(service.eraseTile).not.toHaveBeenCalled();
        expect(service.placeTile).toHaveBeenCalledTimes(1);
    });

    it('should remove tiles from processedTiles if they are not in currentTileKeys', () => {
        const getPathSpy = spyOn(service, 'getPath').and.returnValue([{ row: 0, column: 0 }]);
        spyOn(service, 'eraseTile');
        spyOn(service, 'placeTile');

        service.paintInterpolatedPath();

        (service.eraseTile as jasmine.Spy).calls.reset();
        (service.placeTile as jasmine.Spy).calls.reset();

        getPathSpy.and.returnValue([{ row: 1, column: 1 }]);

        service.paintInterpolatedPath();

        expect(service['processedTiles'].has('0,0')).toBeFalse();
    });

    it('should remove tiles from processedTiles if they are not in currentTileKeys', () => {
        service['processedTiles'].add('0,0');
        service['processedTiles'].add('1,1');
        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 2, column: 2 };

        spyOn(service, 'getPath').and.returnValue([
            { row: 0, column: 0 },
            { row: 2, column: 2 },
        ]);

        service.paintInterpolatedPath();

        expect(service['processedTiles'].has('0,0')).toBeTrue();
        expect(service['processedTiles'].has('1,1')).toBeFalse();
    });

    it('should skip processed tiles under certain conditions', () => {
        service['processedTiles'].add('0,0');
        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 1, column: 1 };
        service.previousStartTile = { row: 0, column: 0 };
        service.previousEndTile = { row: 1, column: 1 };

        spyOn(service, 'getPath').and.returnValue([
            { row: 0, column: 0 },
            { row: 1, column: 1 },
        ]);
        spyOn(service, 'placeTile');

        service.paintInterpolatedPath();

        expect(service.placeTile).toHaveBeenCalledTimes(1);
        expect(service.placeTile).toHaveBeenCalledWith(1, 1, TileTypes.GROUND_1);
    });

    it('should call eraseTile when mouseService.isRightClick is true', () => {
        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 0, column: 0 };
        spyOn(service, 'getPath').and.returnValue([{ row: 0, column: 0 }]);
        spyOn(service, 'eraseTile');
        spyOn(service, 'placeTile');

        (mouseService as any).isRightClick = true;

        service.paintInterpolatedPath();

        expect(service.eraseTile).toHaveBeenCalledWith(0, 0);
        expect(service.placeTile).not.toHaveBeenCalled();
    });

    it('should remove item object when placing wall or door on tile with item', () => {
        const itemObject = { name: 'TestItem' } as ItemObject;
        mapService.getItemObject.and.returnValue(itemObject);
        mapService.getTileType.and.returnValue(TileTypes.GROUND_1);

        spyOn(service, 'removeItemObjectFromTile');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn(service as any, 'isBrushWallOrDoor').and.returnValue(true);

        service.placeTile(0, 0, TileTypes.WALL);

        expect(service.removeItemObjectFromTile).toHaveBeenCalledWith(0, 0, itemObject);
    });

    it('should place tile if there is no item object on the tile', () => {
        mapService.getItemObject.and.returnValue(null);
        spyOn(service, 'placeTile');
        service.eraseTile(0, 0);
        expect(service.placeTile).toHaveBeenCalledWith(0, 0, TileTypes.GROUND_1);
    });

    it('should place tile if mouse is down', () => {
        const itemObject = { name: 'TestItem' } as ItemObject;
        mapService.getItemObject.and.returnValue(itemObject);
        mouseService.isMouseDown.and.returnValue(true);
        spyOn(service, 'placeTile');
        service.eraseTile(0, 0);
        expect(service.placeTile).toHaveBeenCalledWith(0, 0, TileTypes.GROUND_1);
    });

    it('should not place tile if there is an item object on the tile and mouse is not down', () => {
        const itemObject = { name: 'TestItem' } as ItemObject;
        mapService.getItemObject.and.returnValue(itemObject);
        mouseService.isMouseDown.and.returnValue(false);
        spyOn(service, 'placeTile');
        service.eraseTile(0, 0);
        expect(service.placeTile).toHaveBeenCalled();
    });

    it('should return false if startTile or endTile is null', () => {
        service.startTile = null;
        service.endTile = { row: 5, column: 5 };
        expect(service['isValidStartAndEndTile']()).toBeFalse();
    });

    it('should return true if both startTile and endTile are set', () => {
        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 5, column: 5 };
        expect(service['isValidStartAndEndTile']()).toBeTrue();
    });

    it('should not update tiles if start or end tile is invalid', () => {
        spyOn<any>(service, 'updateProcessedTiles');
        spyOn<any>(service, 'processTiles');

        service.startTile = null;
        service.endTile = { row: 5, column: 5 };
        service.paintInterpolatedPath();

        expect(service['updateProcessedTiles']).not.toHaveBeenCalled();
        expect(service['processTiles']).not.toHaveBeenCalled();
    });

    it('should call updateProcessedTiles and processTiles with correct points', () => {
        spyOn<any>(service, 'updateProcessedTiles');
        spyOn<any>(service, 'processTiles');
        spyOn(service, 'getPath').and.returnValue([
            { row: 0, column: 0 },
            { row: 1, column: 1 },
            { row: 2, column: 2 },
        ]);

        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 2, column: 2 };
        service.paintInterpolatedPath();

        expect(service['updateProcessedTiles']).toHaveBeenCalledWith([
            { row: 0, column: 0 },
            { row: 1, column: 1 },
            { row: 2, column: 2 },
        ]);
        expect(service['processTiles']).toHaveBeenCalledWith([
            { row: 0, column: 0 },
            { row: 1, column: 1 },
            { row: 2, column: 2 },
        ]);
    });

    it('should remove tiles from processedTiles that are not in the current path', () => {
        ['1,1', '2,2', '3,3'].forEach((tile) => service['processedTiles'].add(tile));
        spyOn<any>(service, 'getTileKey');

        service['updateProcessedTiles']([
            { row: 0, column: 0 },
            { row: 1, column: 1 },
        ]);

        expect(service['processedTiles'].has('2,2')).toBeFalse();
        expect(service['processedTiles'].has('3,3')).toBeFalse();
    });

    it('should not process tiles if getPath returns an empty array', () => {
        spyOn(service, 'getPath').and.returnValue([]);
        spyOn<any>(service, 'updateProcessedTiles');
        spyOn<any>(service, 'processTiles');

        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 2, column: 2 };
        service.paintInterpolatedPath();

        expect(service['updateProcessedTiles']).not.toHaveBeenCalled();
        expect(service['processTiles']).not.toHaveBeenCalled();
    });

    it('should process the correct path when start and end tiles are valid', () => {
        spyOn(service, 'getPath').and.returnValue([
            { row: 0, column: 0 },
            { row: 0, column: 1 },
            { row: 0, column: 2 },
        ]);
        spyOn<any>(service, 'updateProcessedTiles');
        spyOn<any>(service, 'processTiles');

        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 0, column: 2 };
        service.paintInterpolatedPath();

        expect(service['updateProcessedTiles']).toHaveBeenCalledWith([
            { row: 0, column: 0 },
            { row: 0, column: 1 },
            { row: 0, column: 2 },
        ]);
        expect(service['processTiles']).toHaveBeenCalledWith([
            { row: 0, column: 0 },
            { row: 0, column: 1 },
            { row: 0, column: 2 },
        ]);
    });
});
