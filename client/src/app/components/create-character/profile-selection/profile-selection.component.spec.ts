import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { ProfileSelectionComponent } from './profile-selection.component';
describe('ProfileSelectionComponent', () => {
    let component: ProfileSelectionComponent;
    let fixture: ComponentFixture<ProfileSelectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileSelectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have 12 images with valid paths', () => {
        const testValue = 12;
        expect(component.imagesPath.length).toBe(testValue);
        component.imagesPath.forEach((path) => {
            expect(path.imagePath).toMatch(/^assets\/images\/.+\.(jpg|png|gif)$/);
        });
    });

    it('should select an item when clickItem is called', () => {
        const itemId = 5;
        component.clickItem(itemId);
        expect(component.itemSelected).toBe(itemId);
    });

    it('should emit selected event when clickItem is called', () => {
        spyOn(component.selected, 'emit');
        const itemId = 3;
        component.clickItem(itemId);
        expect(component.selected.emit).toHaveBeenCalledWith(itemId);
    });

    it('should render images', () => {
        const testValue = 12;
        const images = fixture.debugElement.queryAll(By.css('img'));
        expect(images.length).toBe(testValue);
    });
});
