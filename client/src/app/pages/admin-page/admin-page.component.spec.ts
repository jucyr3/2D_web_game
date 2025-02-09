import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPageComponent } from './admin-page.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MapService } from '@app/services/edit-services/map.service';
import { MapsForClientService } from '@app/services/maps-for-client.service';
import { BehaviorSubject } from 'rxjs';
import { Map } from '@common/map';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let router: jasmine.SpyObj<Router>;
    let mapService: jasmine.SpyObj<MapService>;
    let mapsForClientService: jasmine.SpyObj<MapsForClientService>;

    const mockMap: Map = {
        id: 1,
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test',
        gameMode: 'Classic',
        tileMatrix: [],
        lastModified: new Date(),
        previewImage: '',
    };

    beforeEach(async () => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const mapServiceSpy = jasmine.createSpyObj('MapService', ['createEmptyMap']);
        const mapsServiceSpy = jasmine.createSpyObj('MapsForClientService', ['loadMaps', 'loadMapsByVisibility'], {
            mapsSubject: new BehaviorSubject<Map[]>([mockMap]),
        });

        await TestBed.configureTestingModule({
            imports: [AdminPageComponent],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: MapService, useValue: mapServiceSpy },
                { provide: MapsForClientService, useValue: mapsServiceSpy },
                { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
            ],
        }).compileComponents();

        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
        mapsForClientService = TestBed.inject(MapsForClientService) as jasmine.SpyObj<MapsForClientService>;
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(mapsForClientService.loadMaps).toHaveBeenCalled();
    });

    it('should navigate to home', () => {
        component.openQuitDialog();
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should toggle modal state', () => {
        component.openCreateModal();
        expect(component.isCreateModalOpen).toBeTrue();

        component.closeCreateModal();
        expect(component.isCreateModalOpen).toBeFalse();
    });

    describe('handleCreateMap', () => {
        beforeEach(() => {
            spyOn(window, 'alert');
        });

        it('should validate empty name', () => {
            const result = component.handleCreateMap({ mapName: '   ' });
            expect(result).toBeFalse();
            expect(window.alert).toHaveBeenCalledWith('Map name cannot be empty');
        });

        it('should validate duplicate name', () => {
            const result = component.handleCreateMap({ mapName: 'Test Map' });
            expect(result).toBeFalse();
            expect(window.alert).toHaveBeenCalledWith('Map name already exists');
        });

        it('should validate map size', () => {
            const result = component.handleCreateMap({
                mapName: 'New Map',
                mapSize: 'INVALID',
            });
            expect(result).toBeFalse();
            expect(window.alert).toHaveBeenCalledWith('Invalid map size');
        });

        it('should create map successfully', () => {
            const formData = {
                mapName: 'New Map',
                mapMode: 'Classic',
                mapSize: 'PETITE',
            };

            const result = component.handleCreateMap(formData);

            expect(result).toBeTrue();
            expect(mapService.createEmptyMap).toHaveBeenCalledWith({
                name: 'New Map',
                gameMode: 'Classic',
                size: '10',
            });
            expect(router.navigate).toHaveBeenCalledWith(['edit']);
            expect(component.isCreateModalOpen).toBeFalse();
        });

        it('should handle creation error', () => {
            mapService.createEmptyMap.and.throwError('Error');

            const result = component.handleCreateMap({
                mapName: 'New Map',
                mapMode: 'Classic',
                mapSize: 'PETITE',
            });

            expect(result).toBeFalse();
            expect(window.alert).toHaveBeenCalledWith('Failed to create map');
        });
    });
});
