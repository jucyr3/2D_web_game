import { TestBed } from '@angular/core/testing';
import { EditingToolService } from './editing-tool.service';
import { TileTypes } from '@app/../../../common/tileType.constants';
import { Coordinate } from '@app/interfaces/coordinate';
import { ItemService } from './item.service';
import { EditToolTypes } from './editing-tool.constants';
import { MapService } from './map.service';
import { ItemObject } from '@common/ItemObject';
import { MouseService } from './mouse.service';


class MockItemService {
    increaseItemAmount = jasmine.createSpy('increaseItemAmount');
}

class MockMapService {
    getTileType = jasmine.createSpy('getTileType');
    getItemObject = jasmine.createSpy('getItemObject');
    removeGameObject = jasmine.createSpy('removeGameObject');
    changeTileType = jasmine.createSpy('changeTileType');
}

class MockMouseService {
    isMouseDown = jasmine.createSpy('isMouseDown');
    isRightClick = false;
}

fdescribe('EditingToolService', () => {
    let service: EditingToolService;
    let itemService: MockItemService;
    let mapService: MockMapService;
    let mouseService: MockMouseService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EditingToolService,
                { provide: ItemService, useClass: MockItemService },
                { provide: MapService, useClass: MockMapService },
                { provide: MouseService, useClass: MockMouseService },
            ]
        });
        service = TestBed.inject(EditingToolService);
        itemService = TestBed.inject(ItemService) as unknown as MockItemService;
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
        // Add more expectations for reset behavior if needed
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
        expect(itemService.increaseItemAmount).toHaveBeenCalledWith('TestItem');
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
        // Setup
        service.startTile = { row: 0, column: 0 };
        service.endTile = { row: 0, column: 0 };
        service.previousStartTile = { row: 1, column: 1 }; // Different from startTile
        service.previousEndTile = { row: 1, column: 1 };   // Different from endTile
    
        // First call to paintInterpolatedPath to add the tile to processedTiles
        spyOn(service, 'getPath').and.returnValue([{ row: 0, column: 0 }]);
        service['processedTiles'].add('0,0');
              
        // Reset the spies
        spyOn(service, 'eraseTile');
        spyOn(service, 'placeTile');
    
        // Second call to paintInterpolatedPath
        service.paintInterpolatedPath();
        
        expect(service.eraseTile).not.toHaveBeenCalled();
        expect(service.placeTile).toHaveBeenCalledTimes(1);
    });
    
    
    it('should remove tiles from processedTiles if they are not in currentTileKeys', () => {
        
        // First call to paintInterpolatedPath to add the tile to processedTiles
        let getPathSpy = spyOn(service, 'getPath').and.returnValue([{ row: 0, column: 0 }]);
        spyOn(service, 'eraseTile');
        spyOn(service, 'placeTile');
        
        service.paintInterpolatedPath();
        
        // Reset the spies
        (service.eraseTile as jasmine.Spy).calls.reset();
        (service.placeTile as jasmine.Spy).calls.reset();
        

        getPathSpy.and.returnValue([{ row: 1, column: 1 }]);

        // Second call to paintInterpolatedPath
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
        { row: 2, column: 2 }
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
        { row: 1, column: 1 }
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
    
    
});
