import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Routes, provideRouter } from '@angular/router';
import { MainPageComponent } from './main-page.component';

/* eslint-disable */

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let compiled: HTMLElement;

    const routes: Routes = [];
    const EXPECTED_BUTTON_COUNT = 3;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MainPageComponent],
            providers: [provideRouter(routes)],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        compiled = fixture.nativeElement;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should render the title correctly', () => {
        const titleElement = compiled.querySelector('.home-page__title') as HTMLElement;
        expect(titleElement.textContent).toContain(component.title);
    });

    it('should render the buttons with correct text', () => {
        const buttons = compiled.querySelectorAll('.button');
        expect(buttons.length).toBe(EXPECTED_BUTTON_COUNT);
        expect(buttons[0].textContent).toContain('Joindre une partie');
        expect(buttons[1].textContent).toContain('Créer une partie');
        expect(buttons[2].textContent).toContain('Administrer les jeux');
    });

    it('should have correct router links in buttons', () => {
        const buttons = compiled.querySelectorAll('.button');
        expect(buttons[0].getAttribute('routerLink')).toBe('/game');
        expect(buttons[1].getAttribute('routerLink')).toBe('/match');
        expect(buttons[2].getAttribute('routerLink')).toBe('/admin');
    });

    it('should render the footer with team names', () => {
        const footerText = compiled.querySelector('.home-page__footer p')?.textContent;
        expect(footerText).toContain('Alhassane Barry');
        expect(footerText).toContain('Vincent Charbonneau');
        expect(footerText).toContain('Julien Cyr');
        expect(footerText).toContain('Danya Li');
        expect(footerText).toContain('Tristan Samson');
        expect(footerText).toContain('Cedric Andy Vaval');
    });
});
