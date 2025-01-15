import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminPageComponent } from './admin-page.component';
import { Game } from '@common/game';
import { Map } from '@common/map';
import { Tile } from '@common/tile';

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

    const createTestGame = (id: number = 1, size: number = 10): Game => {
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
        component.loadGames();
        expect(component.games.length).toBeGreaterThan(0);
    });

    it('should toggle game visibility', () => {
        const game = createTestGame();
        const initialVisibility = game.map.isVisible;
        component.toggleVisibility(game);
        expect(game.map.isVisible).toBe(!initialVisibility);
    });

    it('should delete game', () => {
        const game = createTestGame();
        component.games = [game];
        spyOn(window, 'confirm').and.returnValue(true);
        
        component.deleteGame(game);
        expect(component.games.length).toBe(0);
    });

    it('should show and hide game description', () => {
        const game = createTestGame();
        
        component.showDescription(game);
        expect(component.selectedGame).toBe(game);
        
        component.hideDescription();
        expect(component.selectedGame).toBeNull();
    });

    it('should have correct game properties after loading', () => {
        component.loadGames();
        const firstGame = component.games[0];
        
        expect(firstGame.id).toBeDefined();
        expect(firstGame.gameName).toBeDefined();
        expect(firstGame.map).toBeDefined();
        expect(firstGame.map.size).toBeDefined();
        expect(firstGame.map.gameMode).toBeDefined();
        expect(Array.isArray(firstGame.map.tileMatrix)).toBe(true);
    });
});