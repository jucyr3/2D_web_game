import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { DialogData, PopUpComponent } from './pop-up.component';
/* eslint-disable */

describe('PopUpComponent', () => {
    let component: PopUpComponent;
    let fixture: ComponentFixture<PopUpComponent>;
    const dialogData: DialogData = {
        title: 'Test Title',
        content: 'Test Content',
        cancelButtonLabel: 'Cancel',
        confirmButtonLabel: 'Confirm',
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopUpComponent],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: dialogData }],
        }).compileComponents();

        fixture = TestBed.createComponent(PopUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct title', () => {
        const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
        expect(titleElement.textContent).toContain(dialogData.title);
    });

    it('should display the correct content', () => {
        const contentElement = fixture.debugElement.query(By.css('mat-dialog-content')).nativeElement;
        expect(contentElement.textContent).toContain(dialogData.content);
    });

    it('should display the correct cancel button label', () => {
        const cancelButtonElement = fixture.debugElement.query(By.css('.button1')).nativeElement;
        expect(cancelButtonElement.textContent).toContain(dialogData.cancelButtonLabel);
    });

    it('should display the correct confirm button label', () => {
        const confirmButtonElement = fixture.debugElement.query(By.css('.button2')).nativeElement;
        expect(confirmButtonElement.textContent).toContain(dialogData.confirmButtonLabel);
    });

    it('should emit confirmed event when confirm button is clicked', () => {
        spyOn(component.confirmed, 'emit');
        const confirmButtonElement = fixture.debugElement.query(By.css('.button2')).nativeElement;
        confirmButtonElement.click();
        expect(component.confirmed.emit).toHaveBeenCalledWith(true);
    });
    it('should initialize with provided dialog data', () => {
        expect(component.title).toBe(dialogData.title);
        expect(component.content).toBe(dialogData.content);
        expect(component.cancelButtonLabel).toBe(dialogData.cancelButtonLabel);
        expect(component.confirmButtonLabel).toBe(dialogData.confirmButtonLabel);
    });

    it('should initialize with default values if no data is provided', () => {
        const dialogData: DialogData = {
            title: '',
            content: '',
            cancelButtonLabel: '',
            confirmButtonLabel: '',
        };
        const newComponent = new PopUpComponent(dialogData);
        fixture.detectChanges();

        expect(newComponent.title).toBe('Confirmer la sortie');
        expect(newComponent.content).toBe("Quitter maintenant vous retirera de la liste d'attente");
        expect(newComponent.cancelButtonLabel).toBe('Annuler');
        expect(newComponent.confirmButtonLabel).toBe('Quitter');
    });
});
