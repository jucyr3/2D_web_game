import { ComponentFixture, TestBed, } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WaitingRoomServiceService } from '@app/services/waiting-room-service.service';
import { WaitingRoomPageComponent } from './waiting-room-page.component';
import SpyObj = jasmine.SpyObj;
import { of } from 'rxjs';

describe('WaitingRoomPageComponent', () => {
    let component: WaitingRoomPageComponent;
    let fixture: ComponentFixture<WaitingRoomPageComponent>;
    let waitingRoomServiceSpy: SpyObj<WaitingRoomServiceService>;
    let dialogSpy: SpyObj<MatDialog>;
    let routerSpy: SpyObj<Router>;

    beforeEach(async () => {
        waitingRoomServiceSpy = jasmine.createSpyObj('WaitingRoomServiceService', ['getRandomFourDigitNumber']);
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [WaitingRoomPageComponent],
            providers: [
                { provide: WaitingRoomServiceService, useValue: waitingRoomServiceSpy },
                { provide: MatDialog, useValue: dialogSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(WaitingRoomPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call getRandomFourDigitNumber on init', () => {
        const randomMockNumber = 1234;
        waitingRoomServiceSpy.getRandomFourDigitNumber.and.returnValue(randomMockNumber);

        component.ngOnInit();

        expect(waitingRoomServiceSpy.getRandomFourDigitNumber).toHaveBeenCalled();
        expect(component.accessCode).toEqual(randomMockNumber);
        
    });

    it('should open quit dialog and navigate to home on confirmation', () => {
        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'componentInstance']);
        dialogRefSpy.componentInstance = { confirmed: of(true) }; 
        dialogSpy.open.and.returnValue(dialogRefSpy);

        component.openQuitDialog();

        expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
            width: '35%',
            data: {
                title: 'Confirmer la sortie',
                content: 'Quitter maintenant vous retirera de la liste. Êtes-vous sûr de vouloir quitter?',
                cancelButtonLabel: 'Non',
                confirmButtonLabel: 'Oui',
            },
        });
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should not navigate to home if quit dialog is canceled', () => {
        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'componentInstance']);
        dialogRefSpy.componentInstance = { confirmed: of(false) };
        dialogSpy.open.and.returnValue(dialogRefSpy);

        component.openQuitDialog();

        expect(dialogSpy.open).toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
});