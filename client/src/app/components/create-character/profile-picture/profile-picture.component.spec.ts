import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProfilePictureComponent } from './profile-picture.component';

describe('ProfilePictureComponent', () => {
    let component: ProfilePictureComponent;
    let fixture: ComponentFixture<ProfilePictureComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfilePictureComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfilePictureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit selected event with item number on click', () => {
        spyOn(component.selected, 'emit');
        component.itemNumber = 1;
        const element = fixture.debugElement.query(By.css('div'));
        element.triggerEventHandler('click', null);
        expect(component.selected.emit).toHaveBeenCalledWith(component.itemNumber);
    });

    it('should set imagePath input correctly', () => {
        component.imagePath = 'path/to/image.jpg';
        fixture.detectChanges();
        expect(component.imagePath).toBe('path/to/image.jpg');
    });

    it('should set isSelected input correctly', () => {
        component.isSelected = true;
        fixture.detectChanges();
        expect(component.isSelected).toBeTrue();
    });

    it('should have the correct class when isSelected is true', () => {
        component.isSelected = true;
        fixture.detectChanges();
        const element = fixture.debugElement.query(By.css('div'));
        expect(element.classes['isClicked']).toBeTrue();
    });

    it('should not have the selected class when isSelected is false', () => {
        component.isSelected = false;
        fixture.detectChanges();
        const element = fixture.debugElement.query(By.css('div'));
        expect(element.classes['selected']).toBeFalsy();
    });

    it('should display the correct image path in the img element', () => {
        component.imagePath = 'path/to/image.jpg';
        fixture.detectChanges();
        const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
        expect(imgElement.src).toContain('path/to/image.jpg');
    });
});
