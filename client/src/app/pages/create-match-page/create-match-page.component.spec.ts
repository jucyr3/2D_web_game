import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateMatchPageComponent } from './create-match-page.component';
import { Router } from '@angular/router';
import { MapsForClientService } from '@app/services/maps-for-client.service';
import { BehaviorSubject } from 'rxjs';
import { Map } from '@common/map';

describe('CreateMatchPageComponent', () => { // TODO : fix
  let component: CreateMatchPageComponent;
  let fixture: ComponentFixture<CreateMatchPageComponent>;
  let router: jasmine.SpyObj<Router>;
  let mapsService: jasmine.SpyObj<MapsForClientService>;

  const mockMap: Map = {
    id: 1,
    name: 'Test Map',
    size: 10,
    isVisible: true,
    description: 'Test',
    gameMode: 'Classic',
    tileMatrix: [],
    lastModified: new Date(),
    previewImage: ''
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    
    const mapsServiceSpy = jasmine.createSpyObj('MapsForClientService',
      ['loadMapsByVisibility', 'changeClickedMap'],
      {
        maps$: new BehaviorSubject<Map[]>([mockMap]),
        clickedMap: mockMap
      }
    );

    await TestBed.configureTestingModule({
      imports: [CreateMatchPageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MapsForClientService, useValue: mapsServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mapsService = TestBed.inject(MapsForClientService) as jasmine.SpyObj<MapsForClientService>;
    fixture = TestBed.createComponent(CreateMatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home', () => {
    component.openQuitDialog();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  describe('createGame', () => {
    it('should navigate to character if map exists', () => {
      component.createGame();
      expect(mapsService.loadMapsByVisibility).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/character']);
    });

    it('should navigate to match and show alert if map not found', fakeAsync(() => {
      spyOn(window, 'alert');
      mapsService.maps$ = new BehaviorSubject<Map[]>([{...mockMap, id: 2}]);
      mapsService.clickedMap = mockMap;
      
      component.createGame();
      tick(500);
      
      expect(router.navigate).toHaveBeenCalledWith(['/match']);
      expect(window.alert).toHaveBeenCalledWith('La carte fut cachée ou effacée');
    }));
  });

  describe('onBodyClick', () => { // TODO : FIX 
    it('should clear clickedMap when clicking outside game-card and buttons', () => {
        const div = document.createElement('div');
        spyOn(div, 'closest').and.callFake((selector: string) => {
          if (selector === '.game-card' || selector === 'button') {
            return null;
          }
          return div;
        });
        
        const event = new MouseEvent('click');
        Object.defineProperty(event, 'target', { value: div });
        mapsService.clickedMap = mockMap;
        
        component.onBodyClick(event);
        expect(mapsService.clickedMap).toBeNull();
      });

    it('should not clear clicked map when clicking game card', () => {
      const gameCard = document.createElement('div');
      gameCard.className = 'game-card';
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: gameCard });
      spyOn(gameCard, 'closest').and.returnValue(gameCard);
      
      component.onBodyClick(event);
      expect(mapsService.clickedMap).not.toBeNull();
    });
  });
});