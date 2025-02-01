import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProfileService } from '@app/services/profile.service';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';
import { ProfileSelectionComponent } from './profile-selection.component';

describe('ProfileSelectionComponent', () => {
    let component: ProfileSelectionComponent;
    let fixture: ComponentFixture<ProfileSelectionComponent>;
    let profileServiceMock: Partial<ProfileService>;

    beforeEach(async () => {
        profileServiceMock = {
            imagesPath: [
                { id: 1, imagePath: 'assets/images/1.jpg' },
                { id: 2, imagePath: 'assets/images/2.jpg' },
                { id: 3, imagePath: 'assets/images/3.jpg' },
                { id: 4, imagePath: 'assets/images/4.jpg' },
                { id: 5, imagePath: 'assets/images/5.jpg' },
                { id: 6, imagePath: 'assets/images/6.jpg' },
                { id: 7, imagePath: 'assets/images/7.jpg' },
                { id: 8, imagePath: 'assets/images/8.jpg' },
                { id: 9, imagePath: 'assets/images/9.jpg' },
                { id: 10, imagePath: 'assets/images/10.jpg' },
                { id: 11, imagePath: 'assets/images/11.jpg' },
                { id: 12, imagePath: 'assets/images/12.jpg' },
            ],
            getSelectedItem: jasmine.createSpy('getSelectedItem').and.returnValue(() => 4),
            setSelectedItem: jasmine.createSpy('setSelectedItem'),
        };

        await TestBed.configureTestingModule({
            imports: [ProfileSelectionComponent],
            providers: [{ provide: ProfileService, useValue: profileServiceMock }],
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
    it('shoud have the right selected item from the service', () => {
        const selectedItem = component.itemSelected;
        expect(selectedItem).toEqual(4);
    });

    it('should render images', () => {
        const testValue = 12;
        const images = fixture.debugElement.queryAll(By.css('img'));
        expect(images.length).toBe(testValue);
    });

    it('should update the selected item in ProfileService when an image is clicked"', () => {
        const itemId = 2;
        component.clickItem(itemId);
        expect(profileServiceMock.setSelectedItem).toHaveBeenCalledWith(itemId);
    });

    it('should display images with correct src attributes', () => {
        const images = fixture.debugElement.queryAll(By.css('img'));
        images.forEach((img, index) => {
            expect(img.nativeElement.src).toContain(component.imagesPath[index].imagePath);
        });
    });

    it('should call profileService.getSelectedItem when itemSelected is accessed', () => {
        const selectedItem = component.itemSelected;
        expect(profileServiceMock.getSelectedItem).toHaveBeenCalled();
        expect(selectedItem).toEqual(4);
    });

    it('should set isSelected=true for the selected item and false for others', () => {
        const profilePictureComponents = fixture.debugElement.queryAll(By.directive(ProfilePictureComponent));
        const selectedItem = component.itemSelected;

        profilePictureComponents.forEach((component, index) => {
            const isSelected = component.componentInstance.isSelected;
            const itemNumber = component.componentInstance.itemNumber;

            if (itemNumber === selectedItem) {
                expect(isSelected).toBeTrue();
            } else {
                expect(isSelected).toBeFalse();
            }
        });
    });

});
