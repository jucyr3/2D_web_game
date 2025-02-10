import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameGridComponent } from './games-grid.component';
import { MapsForClientService } from '@app/services/maps-for-client.service';
import { PreviewContainerComponent } from '@app/components/admin-game/preview-container/preview-container.component';
import { GameInfoComponent } from '@app/components/admin-game/game-info/game-info.component';
import { GameActionsComponent } from '@app/components/admin-game/game-actions/game-actions.component';
import { CommonModule } from '@angular/common';

describe('GameGridComponent', () => {
    let component: GameGridComponent;
    let fixture: ComponentFixture<GameGridComponent>;
    let mockMapsForClientService: jasmine.SpyObj<MapsForClientService>;

    beforeEach(async () => {
        mockMapsForClientService = jasmine.createSpyObj('MapsForClientService', ['loadMaps']);

        await TestBed.configureTestingModule({
            imports: [CommonModule, GameGridComponent, PreviewContainerComponent, GameInfoComponent, GameActionsComponent],
            providers: [{ provide: MapsForClientService, useValue: mockMapsForClientService }],
        }).compileComponents();

        fixture = TestBed.createComponent(GameGridComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call loadMaps on initialization', () => {
        fixture.detectChanges();
        expect(mockMapsForClientService.loadMaps).toHaveBeenCalled();
    });

    it('should call loadMaps when onRefresh is called', () => {
        component.onRefresh();
        expect(mockMapsForClientService.loadMaps).toHaveBeenCalled();
    });
});
