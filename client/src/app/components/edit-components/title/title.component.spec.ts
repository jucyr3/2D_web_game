import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleComponent } from './title.component';
import { MapService } from '@app/services/map.service';

/* eslint-disable */

describe('TitleComponent', () => {
    let component: TitleComponent;
    let fixture: ComponentFixture<TitleComponent>;
    let mapService: jasmine.SpyObj<MapService>;

    beforeEach(async () => {
        const mapServiceSpy = jasmine.createSpyObj('MapService', [], {
            map: { name: 'Initial Title' },
        });

        await TestBed.configureTestingModule({
            declarations: [],
            imports: [TitleComponent],
            providers: [{ provide: MapService, useValue: mapServiceSpy }],
        }).compileComponents();

        mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
        fixture = TestBed.createComponent(TitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with title from MapService', () => {
        expect(component.title).toBe('Initial Title');
    });

    it('should update title on input', () => {
        const event = { target: { value: 'New Title' } } as unknown as Event;
        component.onTitleInput(event);
        expect(component.title).toBe('New Title');
    });

    it('should update MapService on blur', () => {
        component.title = 'Updated Title';
        component.onBlur();
        expect(mapService.map.name).toBe('Updated Title');
    });

    it('should reset title to "Untitled" if input is blank', () => {
        component.title = '   ';
        component.updateValue();
        expect(component.title).toBe('Untitled');
        expect(mapService.map.name).toBe('Untitled');
    });

    it('should not change title if input is not blank', () => {
        component.title = 'Valid Title';
        component.updateValue();
        expect(component.title).toBe('Valid Title');
        expect(mapService.map.name).toBe('Valid Title');
    });
});
