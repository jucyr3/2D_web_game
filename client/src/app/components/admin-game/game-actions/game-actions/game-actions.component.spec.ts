import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ClientHttpRequestsService } from '@app/services/client-http-requests.service';
import { MapService } from '@app/services/map.service';
import { Map } from '@common/map';
import { of, throwError } from 'rxjs';
import { GameActionsComponent } from './game-actions.component';

fdescribe('GameActionsComponent', () => {
    let component: GameActionsComponent;
    let fixture: ComponentFixture<GameActionsComponent>;
    let clientHttpRequestSpy: jasmine.SpyObj<ClientHttpRequestsService>;
    let mapServiceSpy: jasmine.SpyObj<MapService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let confirmSpy: jasmine.Spy;

    const mockMap: Map = {
        id: 123,
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test description',
        gameMode: 'Classic',
        tileMatrix: Array(10).fill(Array(10).fill(null)),
        lastModified: new Date('2024-02-06'),
        previewImage: 'test-image.png'
    };

    beforeEach(async () => {
        clientHttpRequestSpy = jasmine.createSpyObj('ClientHttpRequestsService', ['updateMapVisibility', 'deleteMap']);
        mapServiceSpy = jasmine.createSpyObj('MapService', ['loadMapFromServer']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        confirmSpy = spyOn(window, 'confirm');

        await TestBed.configureTestingModule({
            imports: [GameActionsComponent],
            providers: [
                { provide: ClientHttpRequestsService, useValue: clientHttpRequestSpy },
                { provide: MapService, useValue: mapServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(GameActionsComponent);
        component = fixture.componentInstance;
        component.map = mockMap;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('toggleVisibility', () => {
        it('should emit refresh event on successful visibility update', () => {
            clientHttpRequestSpy.updateMapVisibility.and.returnValue(of({ ...mockMap, isVisible: false }));
            spyOn(component.refresh, 'emit');

            component.toggleVisibility(mockMap);

            expect(clientHttpRequestSpy.updateMapVisibility).toHaveBeenCalledWith(mockMap.id, !mockMap.isVisible);
            expect(component.refresh.emit).toHaveBeenCalled();
        });

        it('should handle error when updating visibility', () => {
            const error = new Error('Update failed');
            clientHttpRequestSpy.updateMapVisibility.and.returnValue(throwError(() => error));
            spyOn(console, 'error');

            component.toggleVisibility(mockMap);

            expect(console.error).toHaveBeenCalledWith('Error updating game visibility:', error);
        });
    });

    describe('editMap', () => {
        it('should navigate to edit route and load map', () => {
            component.editMap(mockMap);

            expect(routerSpy.navigate).toHaveBeenCalledWith(['edit', mockMap.id]);
            expect(mapServiceSpy.loadMapFromServer).toHaveBeenCalledWith(mockMap.id);
        });
    });

    describe('deleteMap', () => {
        it('should emit refresh event on successful deletion when confirmed', () => {
            confirmSpy.and.returnValue(true);
            clientHttpRequestSpy.deleteMap.and.returnValue(of(void 0));
            spyOn(component.refresh, 'emit');

            component.deleteMap(mockMap);

            expect(clientHttpRequestSpy.deleteMap).toHaveBeenCalledWith(mockMap.id);
            expect(component.refresh.emit).toHaveBeenCalled();
        });

        it('should handle error when deleting map', () => {
            confirmSpy.and.returnValue(true);
            const error = new Error('Delete failed');
            clientHttpRequestSpy.deleteMap.and.returnValue(throwError(() => error));
            spyOn(console, 'error');

            component.deleteMap(mockMap);

            expect(console.error).toHaveBeenCalledWith('Error deleting game:', error);
        });

        it('should not delete when user cancels confirmation', () => {
            confirmSpy.and.returnValue(false);
            
            component.deleteMap(mockMap);

            expect(clientHttpRequestSpy.deleteMap).not.toHaveBeenCalled();
        });
    });
});