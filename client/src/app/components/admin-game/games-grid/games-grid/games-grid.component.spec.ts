// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { GameGridComponent } from './games-grid.component';
// import { MapsForClientService } from '@app/services/maps-for-client.service';
// import { PreviewContainerComponent } from '../../preview-container/preview-container/preview-container.component';
// import { GameInfoComponent } from '../../game-info/game-info.component';
// import { GameActionsComponent } from '../../game-actions/game-actions/game-actions.component';
// import { of } from 'rxjs';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { Map } from '@common/map';
// import { Tile } from '@common/tile';
// import { TileTypes } from '@common/tileType.constants';
// import { ClientHttpRequestsService } from '@app/services/client-http-requests.service';

// describe('GameGridComponent', () => { // TODO : FIX THIS SHIT
//   let component: GameGridComponent;
//   let fixture: ComponentFixture<GameGridComponent>;
//   let mapsService: MapsForClientService;
//   let httpService: jasmine.SpyObj<ClientHttpRequestsService>;
  
//   const testDate = new Date('2025-02-06T12:14:33-05:00');
//   const createTileMatrix = (size: number): Tile[][] => 
//     Array(size).fill(null).map(() => 
//         Array(size).fill(null).map(() => ({
//             type: TileTypes.GROUND_0,
//             isOccupied: false,
//             isObstacle: false,
//             itemObject: null
//         }))
//     );

//   const mockMaps: Map[] = [
//     {
//       id: 1,
//       name: 'Test Map 1',
//       size: 8,
//       isVisible: true,
//       description: 'Test description',
//       gameMode: 'Classic',
//       tileMatrix: createTileMatrix(8),
//       lastModified: testDate,
//       previewImage: 'test-image-1.png'
//     },
//     {
//       id: 2,
//       name: 'Test Map 2',
//       size: 16,
//       isVisible: true,
//       description: 'Test description 2',
//       gameMode: 'CTF',
//       tileMatrix: createTileMatrix(16),
//       lastModified: testDate,
//       previewImage: 'test-image-2.png'
//     }
//   ];

//   beforeEach(async () => {
//     const httpSpy = jasmine.createSpyObj('ClientHttpRequestsService', ['getMaps']);
//     httpSpy.getMaps.and.returnValue(of(mockMaps));

//     await TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//         GameGridComponent,
//         PreviewContainerComponent,
//         GameInfoComponent,
//         GameActionsComponent
//       ],
//       providers: [
//         MapsForClientService,
//         { provide: ClientHttpRequestsService, useValue: httpSpy }
//       ]
//     }).compileComponents();

//     httpService = TestBed.inject(ClientHttpRequestsService) as jasmine.SpyObj<ClientHttpRequestsService>;
//     mapsService = TestBed.inject(MapsForClientService);
//     fixture = TestBed.createComponent(GameGridComponent);
//     component = fixture.componentInstance;

//     mapsService.mapsSubject.next(mockMaps);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load maps on init', () => {
//     component.ngOnInit();
//     expect(httpService.getMaps).toHaveBeenCalled();
//   });

//   it('should render game cards for each map', () => {
//     const gameCards = fixture.nativeElement.querySelectorAll('.game-card');
//     expect(gameCards.length).toBe(mockMaps.length);
//   });

//   it('should pass correct props to preview container', () => {
//     const previewContainer = fixture.debugElement.query(sel => sel.name === 'app-preview-container');
//     expect(previewContainer.properties['map']).toEqual(mockMaps[0]);
//     expect(previewContainer.properties['selectedMap']).toEqual(null);
//   });

//   it('should pass correct props to game info', () => {
//     const gameInfo = fixture.debugElement.query(sel => sel.name === 'app-game-info');
//     expect(gameInfo.properties['name']).toEqual(mockMaps[0].name);
//     expect(gameInfo.properties['size']).toEqual(mockMaps[0].size);
//     expect(gameInfo.properties['mode']).toEqual(mockMaps[0].gameMode);
//     expect(gameInfo.properties['lastModified']).toEqual(mockMaps[0].lastModified);
//   });

//   it('should reload maps when refresh is emitted', () => {
//     const gameActions = fixture.debugElement.query(sel => sel.name === 'app-game-actions');
//     gameActions.triggerEventHandler('refresh', null);
//     expect(httpService.getMaps).toHaveBeenCalled();
//   });
// });