import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionComponent } from './description.component';
import { MapService } from '@app/services/edit-services/map.service';

describe('DescriptionComponent', () => {
    let component: DescriptionComponent;
    let fixture: ComponentFixture<DescriptionComponent>;
    let mapService: jasmine.SpyObj<MapService>;

    beforeEach(async () => {
        const mapServiceSpy = jasmine.createSpyObj('MapService', [], {
            map: { description: 'Initial description' },
        });

        await TestBed.configureTestingModule({
            declarations: [],
            imports: [DescriptionComponent],
            providers: [{ provide: MapService, useValue: mapServiceSpy }],
        }).compileComponents();

        mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
        fixture = TestBed.createComponent(DescriptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with description from MapService', () => {
        expect(component.description).toBe('Initial description');
    });

    it('should update description on input', () => {
        const event = { target: { value: 'New description' } } as unknown as Event;
        component.onDescriptionInput(event);
        expect(component.description).toBe('New description');
    });

    it('should update MapService on blur', () => {
        component.description = 'Updated description';
        component.onBlur();
        expect(mapService.map.description).toBe('Updated description');
    });

    it('should reset description to empty string if input is blank', () => {
        component.description = '   ';
        component.updateValue();
        expect(component.description).toBe('');
        expect(mapService.map.description).toBe('');
    });

    it('should not change description if input is not blank', () => {
        component.description = 'Valid description';
        component.updateValue();
        expect(component.description).toBe('Valid description');
        expect(mapService.map.description).toBe('Valid description');
    });
});
