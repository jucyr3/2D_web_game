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

