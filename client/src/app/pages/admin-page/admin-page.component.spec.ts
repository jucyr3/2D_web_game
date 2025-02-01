import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    
    const createTestTileMatrix = (size: number): Tile[][] => {
        return Array(size).fill(null).map(() => 
            Array(size).fill(null).map(() => ({
                type: "Grass",
                isOccupied: false,
                isObstacle: false
            }))
        );
    };

    const createTestGame = (id: number = 1, size: number = 10): Map => {
        const tileMatrix = createTestTileMatrix(size);
        const map = new Map(
            "Test Map",
            size,
            true,
            "Test Description",
            "Classic",
            tileMatrix,
            new Date(), "null"
        );
        return new Game(id, "Test Game", map);
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminPageComponent],
            providers: [
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load games initially', () => {
        component.loadMaps();
        expect(component.maps.length).toBeGreaterThan(0);
    });

    it('should toggle game visibility', () => {
        const game = createTestGame();
        const initialVisibility = game.map.isVisible;
        component.toggleVisibility(game);
        expect(game.map.isVisible).toBe(!initialVisibility);
    });

    it('should delete game', () => {
        const game = createTestGame();
        component.maps = [game];
        spyOn(window, 'confirm').and.returnValue(true);
        
        component.deleteMap(game);
        expect(component.maps.length).toBe(0);
    });

    it('should show and hide game description', () => {
        const game = createTestGame();
        
        component.showDescription(game);
        expect(component.selectedMap).toBe(game);
        
        component.hideDescription();
        expect(component.selectedMap).toBeNull();
    });

    it('should have correct game properties after loading', () => {
        component.loadMaps();
        const firstGame = component.maps[0];
        
        expect(firstGame.id).toBeDefined();
        expect(firstGame.gameName).toBeDefined();
        expect(firstGame.map).toBeDefined();
        expect(firstGame.map.size).toBeDefined();
        expect(firstGame.map.gameMode).toBeDefined();
        expect(Array.isArray(firstGame.map.tileMatrix)).toBe(true);
    });
});