import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ProfileService } from '@app/services/create-character/profile.service';
import { NameComponent } from './name.component';

describe('NameComponent', () => {
    let component: NameComponent;
    let fixture: ComponentFixture<NameComponent>;
    let profileServiceSpy: jasmine.SpyObj<ProfileService>;

    beforeEach(async () => {
        profileServiceSpy = jasmine.createSpyObj('ProfileService', ['setName']);

        await TestBed.configureTestingModule({
            imports: [FormsModule, NameComponent],
            providers: [{ provide: ProfileService, useValue: profileServiceSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(NameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update name on changeName call', () => {
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'New Name';
        inputElement.dispatchEvent(new Event('input'));

        component.changeName();

        expect(component.name).toBe('New Name');
        expect(profileServiceSpy.setName).toHaveBeenCalledWith('New Name');
    });

    it('should call setName if input is empty', () => {
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input'));

        component.changeName();

        expect(profileServiceSpy.setName).toHaveBeenCalled();
    });

    it('should clear name when input is cleared', () => {
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'Some Name';
        inputElement.dispatchEvent(new Event('input'));

        component.changeName();
        expect(component.name).toBe('Some Name');

        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input'));

        component.changeName();
        expect(component.name).toBe('');
        expect(profileServiceSpy.setName).toHaveBeenCalledWith('');
    });
});
