import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProfileService } from '@app/services/profile.service';
import { CreateCharacterPageComponent } from './create-character-page.component';

fdescribe('CreateCharacterPageComponent', () => {
    let component: CreateCharacterPageComponent;
    let fixture: ComponentFixture<CreateCharacterPageComponent>;
    let routerSpy: jasmine.SpyObj<Router>;
    let profileServiceSpy: jasmine.SpyObj<ProfileService>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getName','showImageSelected']);

        await TestBed.configureTestingModule({
            imports: [CreateCharacterPageComponent],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: ProfileService, useValue: profileServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateCharacterPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to waiting room when name is set', () => {
        profileServiceSpy.getName.and.returnValue('TestName');
        component.verifyCreation();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/waitingRoom']);
    });

    it('should show alert when name is not set', () => {
        profileServiceSpy.getName.and.returnValue('');
        spyOn(window, 'alert');
        component.verifyCreation();
        expect(window.alert).toHaveBeenCalledWith('Veuillez Choisir le nom de votre personnage');
        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
});
