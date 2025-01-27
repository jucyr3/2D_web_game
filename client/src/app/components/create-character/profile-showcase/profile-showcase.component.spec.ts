import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiceComponent } from '@app/components/create-character/dice/dice.component';
import { NameComponent } from '@app/components/create-character/name/name.component';
import { StatComponent } from '@app/components/create-character/stat/stat.component';
import { ProfileService } from '@app/services/profile.service';
import { ProfileShowcaseComponent } from './profile-showcase.component';

describe('ProfileShowcaseComponent', () => {
    let component: ProfileShowcaseComponent;
    let fixture: ComponentFixture<ProfileShowcaseComponent>;
    let profileService: ProfileService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileShowcaseComponent, DiceComponent, NameComponent, StatComponent],
            providers: [ProfileService],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileShowcaseComponent);
        component = fixture.componentInstance;
        profileService = TestBed.inject(ProfileService);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle bonus when clickBonus is called', () => {
        component.clickBonus(true);
        expect(component.bonus).toBeTrue();
        component.clickBonus(false);
        expect(component.bonus).toBeFalse();
    });

    it('should toggle dice when clickDice is called', () => {
        component.clickDice(true);
        expect(component.dice).toBeTrue();
        component.clickDice(false);
        expect(component.dice).toBeFalse();
    });

    it('should update selectedImage when profileService.showImageSelected is called', () => {
        spyOn(profileService, 'showImageSelected').and.returnValue('new-image');
        component.selectedImage = component.profileService.showImageSelected();
        expect(component.selectedImage).toBe('new-image');
    });

    it('should use ProfileService in constructor and initialize selectedImage with the correct value', () => {
        spyOn(profileService, 'showImageSelected').and.returnValue('test-image');
        const newComponent = new ProfileShowcaseComponent(profileService);
        expect(newComponent.selectedImage).toBe('test-image');
    });
});
