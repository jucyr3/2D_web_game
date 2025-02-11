import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProfilePictureComponent } from '@app/components/create-character/profile-picture/profile-picture.component';
import { IMAGES_PATH } from '@app/constants/imagePaths';
import { ProfileService } from '@app/services/create-character/profile.service';
import { ProfileSelectionComponent } from './profile-selection.component';

describe('ProfileSelectionComponent', () => {
    let component: ProfileSelectionComponent;
    let fixture: ComponentFixture<ProfileSelectionComponent>;
    let profileServiceMock: Partial<ProfileService>;

    const SELECTED_ITEM = 4;
    beforeEach(async () => {
        profileServiceMock = {
            imagesPath: IMAGES_PATH,
            getSelectedItem: jasmine.createSpy('getSelectedItem').and.returnValue(() => SELECTED_ITEM),
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
        expect(selectedItem).toEqual(SELECTED_ITEM);
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
        expect(selectedItem).toEqual(SELECTED_ITEM);
    });

    it('should set isSelected=true for the selected item and false for others', () => {
        const profilePictureComponents = fixture.debugElement.queryAll(By.directive(ProfilePictureComponent));
        const selectedItem = component.itemSelected;

        profilePictureComponents.forEach((profilePictureComponent) => {
            const isSelected = profilePictureComponent.componentInstance.isSelected;
            const itemNumber = profilePictureComponent.componentInstance.itemNumber;

            if (itemNumber === selectedItem) {
                expect(isSelected).toBeTrue();
            } else {
                expect(isSelected).toBeFalse();
            }
        });
    });
});
