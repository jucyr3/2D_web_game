import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateMatchPageComponent } from './create-match-page.component';
import { Router } from '@angular/router';
import { MapsForClientService } from '@app/services/maps-for-client.service';
import { ClientHttpRequestsService } from '@app/services/client-http-requests.service';
import { of } from 'rxjs';
import { Map } from '@common/map';

describe('CreateMatchPageComponent', () => {
    let component: CreateMatchPageComponent;
    let fixture: ComponentFixture<CreateMatchPageComponent>;
    let router: jasmine.SpyObj<Router>;
    let mapsForClient: jasmine.SpyObj<MapsForClientService>;
    let clientHttpRequest: jasmine.SpyObj<ClientHttpRequestsService>;
    let clickedMapValue: Map | null;

    const mockMap: Map = {
        mapId: '1',
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test Description',
        gameMode: 'Classic',
        tileMatrix: [],
        lastModified: new Date(),
    };

    beforeEach(async () => {
        clickedMapValue = null;

        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const mapsForClientSpy = {
            ...jasmine.createSpyObj('MapsForClientService', ['loadMaps', 'loadMapsByVisibility', 'changeSelectedMap', 'changeClickedMap']),
            get clickedMap() {
                return clickedMapValue;
            },
            set clickedMap(value) {
                clickedMapValue = value;
            },
            mapsSubject: of([mockMap]),
            maps$: of([mockMap]),
        };
        const clientHttpRequestSpy = jasmine.createSpyObj('ClientHttpRequestsService', ['getAllMapsByVisibility']);

        await TestBed.configureTestingModule({
            imports: [CreateMatchPageComponent],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: MapsForClientService, useValue: mapsForClientSpy },
                { provide: ClientHttpRequestsService, useValue: clientHttpRequestSpy },
            ],
        }).compileComponents();

        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        mapsForClient = TestBed.inject(MapsForClientService) as jasmine.SpyObj<MapsForClientService>;
        clientHttpRequest = TestBed.inject(ClientHttpRequestsService) as jasmine.SpyObj<ClientHttpRequestsService>;

        mapsForClient.loadMapsByVisibility.and.returnValue(undefined);
        mapsForClient.loadMaps.and.returnValue(undefined);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateMatchPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('createGame', () => {
        it('should do nothing if no map is clicked', () => {
            clickedMapValue = null;
            component.createGame();
            expect(clientHttpRequest.getAllMapsByVisibility).not.toHaveBeenCalled();
        });

        it('should navigate to character page if clicked map is visible', fakeAsync(() => {
            clickedMapValue = mockMap;
            clientHttpRequest.getAllMapsByVisibility.and.returnValue(of([mockMap]));

            component.createGame();
            tick();

            expect(router.navigate).toHaveBeenCalledWith(['/character']);
        }));

        it('should show alert, refresh maps, and clear clicked map if clicked map is not visible', fakeAsync(() => {
            const invisibleMap = { ...mockMap, isVisible: false };
            clickedMapValue = invisibleMap;
            clientHttpRequest.getAllMapsByVisibility.and.returnValue(of([]));

            spyOn(window, 'alert');

            component.createGame();
            tick();

            expect(window.alert).toHaveBeenCalledWith('la map sélectionnée fut cachée ou effacée');
            expect(mapsForClient.loadMapsByVisibility).toHaveBeenCalled();
            expect(mapsForClient.clickedMap).toBeNull();
            expect(router.navigate).not.toHaveBeenCalled();
        }));
    });

    describe('onBodyClick', () => {
        it('should clear clickedMap if click is outside game-card and button', () => {
            const mockEvent = new MouseEvent('click');
            const mockTarget = document.createElement('div');
            Object.defineProperty(mockEvent, 'target', { value: mockTarget });

            clickedMapValue = mockMap;
            component.onBodyClick(mockEvent);

            expect(mapsForClient.clickedMap).toBeNull();
        });

        it('should not clear clickedMap if click is inside game-card', () => {
            const mockEvent = new MouseEvent('click');
            const mockTarget = document.createElement('div');
            mockTarget.className = 'game-card';
            Object.defineProperty(mockEvent, 'target', { value: mockTarget });

            clickedMapValue = mockMap;
            component.onBodyClick(mockEvent);

            expect(mapsForClient.clickedMap).toBe(mockMap);
        });

        it('should not clear clickedMap if click is on a button', () => {
            const mockEvent = new MouseEvent('click');
            const mockTarget = document.createElement('button');
            Object.defineProperty(mockEvent, 'target', { value: mockTarget });

            clickedMapValue = mockMap;
            component.onBodyClick(mockEvent);

            expect(mapsForClient.clickedMap).toBe(mockMap);
        });
    });

    describe('openQuitDialog', () => {
        it('should navigate to home page', () => {
            component.openQuitDialog();
            expect(router.navigate).toHaveBeenCalledWith(['/home']);
        });
    });
});
