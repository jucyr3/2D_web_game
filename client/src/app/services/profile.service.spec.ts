import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
    let service: ProfileService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProfileService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set and get the selected item correctly', () => {
        const item = 5;
        service.setSelectedItem(item);
        expect(service.getSelectedItem()()).toBe(item);
    });

    it('should return the correct image path for the selected item', () => {
        const item = 3;
        service.setSelectedItem(item);
        expect(service.showImageSelected()).toBe('assets/images/' + item + '.jpg');
    });

    it('should set and get the dice choice correctly', () => {
        service.setDiceChoice(true);
        expect(service.getdiceChoice()).toBe(true);
    });

    it('should set and get the stat choice correctly', () => {
        service.setStatChoice(true);
        expect(service.getstatChoice()).toBe(true);
    });

    it('should set and get the name correctly', () => {
        const name = 'Test Name';
        service.setName(name);
        expect(service.getName()).toBe(name);
    });
});
