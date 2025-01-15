import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminPageComponent } from './admin-page.component';
import { Game } from '@common/game';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;

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
        const game = new Game(1, 'Test Game', '10x10', 'Classic', 'test.jpg');
        const initialVisibility = game.isVisible;
        component.toggleVisibility(game);
        expect(game.isVisible).toBe(!initialVisibility);
    });

    it('should delete game', () => {
        const game = new Game(1, 'Test Game', '10x10', 'Classic', 'test.jpg');
        component.games = [game];
        spyOn(window, 'confirm').and.returnValue(true);
        
        component.deleteGame(game);
        expect(component.games.length).toBe(0);
    });
});