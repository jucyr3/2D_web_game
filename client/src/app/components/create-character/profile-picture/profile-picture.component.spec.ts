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
        expect(component.selected.emit).toHaveBeenCalledWith(1);
    });

    it('should set imagePath input correctly', () => {
        component.imagePath = 'path/to/image.jpg';
        fixture.detectChanges();
        expect(component.imagePath).toBe('path/to/image.jpg');
    });
});
