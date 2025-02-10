import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPageComponent } from './admin-page.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MapService } from '@app/services/edit-services/map.service';
import { MapsForClientService } from '@app/services/maps-for-client.service';
import { BehaviorSubject } from 'rxjs';
import { Map } from '@common/map';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let router: jasmine.SpyObj<Router>;
    let mapService: jasmine.SpyObj<MapService>;
    let mapsForClientService: jasmine.SpyObj<MapsForClientService>;

    const mockMaps: Map[] = [
        {
            mapId: 1,
            name: 'Test Map',
            size: 10,
            isVisible: true,
            description: 'Test',
            gameMode: 'Classic',
            tileMatrix: [],
            lastModified: new Date(),
            previewImage: '',
        },
        {
            mapId: 2,
            name: 'CTF Map',
            size: 15,
            isVisible: true,
            description: 'Capture The Flag',
            gameMode: 'CTF',
            tileMatrix: [],
            lastModified: new Date(),
            previewImage: '',
        },
    ];

    beforeEach(async () => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const mapServiceSpy = jasmine.createSpyObj('MapService', ['createEmptyMap']);
        const mapsServiceSpy = jasmine.createSpyObj('MapsForClientService', ['loadMaps', 'loadMapsByVisibility'], {
            mapsSubject: new BehaviorSubject<Map[]>(mockMaps),
        });

        await TestBed.configureTestingModule({
            imports: [AdminPageComponent, FormsModule, CommonModule],
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

    it('should create component and load maps', () => {
        expect(component).toBeTruthy();
        expect(mapsForClientService.loadMaps).toHaveBeenCalledTimes(1);
    });

    describe('Navigation and Modal Controls', () => {
        it('should navigate to home when quit dialog is opened', () => {
            component.openQuitDialog();
            expect(router.navigate).toHaveBeenCalledWith(['/home']);
        });

        it('should properly manage modal state', () => {
            expect(component.isCreateModalOpen).toBeFalse();

            component.openCreateModal();
            expect(component.isCreateModalOpen).toBeTrue();

            component.closeCreateModal();
            expect(component.isCreateModalOpen).toBeFalse();
        });
    });

    describe('Map Creation Success Scenarios', () => {
        it('should create maps with different sizes correctly', () => {
            const testCases = [
                { size: 10, expectedValue: 10 },
                { size: 15, expectedValue: 15 },
                { size: 20, expectedValue: 20 },
            ];

            testCases.forEach(({ size, expectedValue }) => {
                const result = component.handleCreateMap({
                    gameMode: 'Classic',
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    size: size as 10 | 15 | 20,
                });

                expect(result).toBeTrue();
                expect(mapService.createEmptyMap).toHaveBeenCalledWith({
                    gameMode: 'Classic',
                    size: expectedValue,
                });
                expect(router.navigate).toHaveBeenCalledWith(['edit']);
                expect(component.isCreateModalOpen).toBeFalse();
            });
        });

        it('should support both Classic and CTF game modes', () => {
            const gameModes = ['Classic', 'CTF'] as const;

            gameModes.forEach((mode) => {
                const result = component.handleCreateMap({
                    gameMode: mode,
                    size: 10,
                });

                expect(result).toBeTrue();
                expect(mapService.createEmptyMap).toHaveBeenCalledWith({
                    gameMode: mode,
                    size: 10,
                });
            });
        });
    });
    describe('error handling', () => {
        it('should handle map creation error', () => {
            const alertSpy = spyOn(window, 'alert');
            mapService.createEmptyMap.and.throwError('Test error');

            const result = component.handleCreateMap({
                gameMode: 'Classic',
                size: 10,
            });

            expect(alertSpy).toHaveBeenCalledWith('Failed to create map');
            expect(result).toBeFalse();
            expect(component.isCreateModalOpen).toBeFalse();
        });
    });
});
