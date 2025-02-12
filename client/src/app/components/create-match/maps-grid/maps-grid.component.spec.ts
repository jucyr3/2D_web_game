import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapsGridComponent } from './maps-grid.component';
import { MapsForClientService } from '@app/services/maps-for-client.service';
import { PreviewContainerComponent } from '@app/components/admin-game/preview-container/preview-container.component';
import { GameInfoComponent } from '@app/components/admin-game/game-info/game-info.component';
import { BehaviorSubject } from 'rxjs';
import { Map } from '@common/map';

describe('MapsGridComponent', () => {
    let component: MapsGridComponent;
    let fixture: ComponentFixture<MapsGridComponent>;
    let mapsService: jasmine.SpyObj<MapsForClientService>;

    const mockMaps: Map[] = [
        {
            mapId: 1,
            name: 'Test Map 1',
            size: 10,
            isVisible: true,
            description: 'Description 1',
            gameMode: 'Classic',
            tileMatrix: [],
            lastModified: new Date('2024-02-06'),
            previewImage: 'base64string1',
        },
        {
            mapId: 2,
            name: 'Test Map 2',
            size: 15,
            isVisible: true,
            description: 'Description 2',
            gameMode: 'CTF',
            tileMatrix: [],
            lastModified: new Date('2024-02-06'),
            previewImage: 'base64string2',
        },
    ];

    beforeEach(async () => {
        const serviceSpy = jasmine.createSpyObj('MapsForClientService', ['loadMapsByVisibility', 'changeClickedMap'], {
            mapsVisible$: new BehaviorSubject(mockMaps),
            selectedMap: null,
        });

        await TestBed.configureTestingModule({
            imports: [MapsGridComponent, PreviewContainerComponent, GameInfoComponent],
            providers: [{ provide: MapsForClientService, useValue: serviceSpy }],
        }).compileComponents();

        mapsService = TestBed.inject(MapsForClientService) as jasmine.SpyObj<MapsForClientService>;
        fixture = TestBed.createComponent(MapsGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load maps on init', () => {
        expect(mapsService.loadMapsByVisibility).toHaveBeenCalled();
    });

    it('should reset clicked map on refresh', () => {
        component.onRefresh();
        expect(mapsService.changeClickedMap).toHaveBeenCalledWith(null);
    });

    it('should render game cards for each map', () => {
        const gameCards = fixture.nativeElement.querySelectorAll('.game-card');
        expect(gameCards.length).toBe(mockMaps.length);
    });

    it('should change clicked map when card is clicked', () => {
        const firstCard = fixture.nativeElement.querySelector('.game-card');
        firstCard.click();
        expect(mapsService.changeClickedMap).toHaveBeenCalledWith(mockMaps[0]);
    });
});
