import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameInfoComponent } from './game-info.component';

describe('GameInfoComponent', () => {
    let component: GameInfoComponent;
    let fixture: ComponentFixture<GameInfoComponent>;
    let element: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameInfoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GameInfoComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display game information correctly', () => {
        const testDate = new Date('2024-02-06T15:30:00');

        component.name = 'Test Game';
        component.size = 8;
        component.mode = 'Classic';
        component.lastModified = testDate;

        fixture.detectChanges();

        expect(element.querySelector('h2')?.textContent).toBe('Test Game');
        expect(element.querySelectorAll('p')[0].textContent).toBe('Taille: 8 x 8');
        expect(element.querySelectorAll('p')[1].textContent).toBe('Mode: Classique');
        expect(element.querySelectorAll('p')[2].textContent).toContain('2024-02-06 | 15:30');
    });

    it('should display "Capture the flag" when mode is not Classic', () => {
        component.mode = 'CTF';
        fixture.detectChanges();

        expect(element.querySelectorAll('p')[1].textContent).toBe('Mode: Capture the flag');
    });
});
