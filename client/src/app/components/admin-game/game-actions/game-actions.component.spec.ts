import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ClientHttpRequestsService } from '@app/services/client-http-requests.service';
import { MapService } from '@app/services/edit-services/map.service';
import { Map } from '@common/map';
import { of, throwError } from 'rxjs';
import { GameActionsComponent } from './game-actions.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

describe('GameActionsComponent', () => {
    let component: GameActionsComponent;
    let fixture: ComponentFixture<GameActionsComponent>;
    let clientHttpRequestSpy: jasmine.SpyObj<ClientHttpRequestsService>;
    let mapServiceSpy: jasmine.SpyObj<MapService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let confirmSpy: jasmine.Spy;

    const mockMap: Map = {
        mapId: 123,
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test description',
        gameMode: 'Classic',
        tileMatrix: [],
        lastModified: new Date('2024-02-06'),
        previewImage: 'test-image.png',
    };

    beforeEach(async () => {
        clientHttpRequestSpy = jasmine.createSpyObj('ClientHttpRequestsService', ['updateMapVisibility', 'deleteMap']);
        mapServiceSpy = jasmine.createSpyObj('MapService', ['loadMapFromServer']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        confirmSpy = spyOn(window, 'confirm');

        await TestBed.configureTestingModule({
            declarations: [],
            imports: [GameActionsComponent, MatIconModule, CommonModule],
            providers: [
                { provide: ClientHttpRequestsService, useValue: clientHttpRequestSpy },
                { provide: MapService, useValue: mapServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameActionsComponent);
        component = fixture.componentInstance;
        component.map = mockMap;
        fixture.detectChanges();
    });

    describe('GameActionsComponent', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should emit refresh event on successful visibility update', () => {
            const initialVisibility = mockMap.isVisible;
            clientHttpRequestSpy.updateMapVisibility.and.returnValue(
                of({
                    ...mockMap,
                    isVisible: !initialVisibility,
                } as Map),
            );
            spyOn(component.refresh, 'emit');

            component.toggleVisibility(mockMap);

            expect(mockMap.isVisible).toBe(!initialVisibility);
            expect(clientHttpRequestSpy.updateMapVisibility).toHaveBeenCalledWith(mockMap.mapId, !initialVisibility);
            expect(component.refresh.emit).toHaveBeenCalled();
        });

        it('should load map and navigate to edit route on successful load', async () => {
            mapServiceSpy.loadMapFromServer.and.returnValue(Promise.resolve(true));
            routerSpy.navigate.and.returnValue(Promise.resolve(true));

            await component.editMap(mockMap);

            expect(mapServiceSpy.loadMapFromServer).toHaveBeenCalledWith(mockMap.mapId);
            expect(routerSpy.navigate).toHaveBeenCalledWith(['edit', mockMap.mapId]);
        });

        it('should emit refresh event on successful deletion when confirmed', () => {
            confirmSpy.and.returnValue(true);
            clientHttpRequestSpy.deleteMap.and.returnValue(of(void 0));
            spyOn(component.refresh, 'emit');

            component.deleteMap(mockMap);

            expect(clientHttpRequestSpy.deleteMap).toHaveBeenCalledWith(mockMap.mapId);
            expect(component.refresh.emit).toHaveBeenCalled();
        });

        it('should not delete when user cancels confirmation', () => {
            confirmSpy.and.returnValue(false);

            component.deleteMap(mockMap);

            expect(clientHttpRequestSpy.deleteMap).not.toHaveBeenCalled();
        });

        it('should show correct confirmation message', () => {
            confirmSpy.and.returnValue(true);
            clientHttpRequestSpy.deleteMap.and.returnValue(of(void 0));

            component.deleteMap(mockMap);

            expect(confirmSpy).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer ce jeu ?');
        });

        it('should show alert on visibility update error', () => {
            const alertSpy = spyOn(window, 'alert');
            clientHttpRequestSpy.updateMapVisibility.and.returnValue(throwError(() => new Error()));

            component.toggleVisibility(mockMap);

            expect(alertSpy).toHaveBeenCalledWith('Impossible de modifier la visibilité de la carte');
        });

        it('should show alert on delete error', () => {
            confirmSpy.and.returnValue(true);
            const alertSpy = spyOn(window, 'alert');
            clientHttpRequestSpy.deleteMap.and.returnValue(throwError(() => new Error()));

            component.deleteMap(mockMap);

            expect(alertSpy).toHaveBeenCalledWith("Impossible d'enlever la carte");
        });
    });
});
