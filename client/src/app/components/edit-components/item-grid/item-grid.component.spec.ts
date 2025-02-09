import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ItemGridComponent } from './item-grid.component';
import { provideTippyLoader, provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper/config';
import { DragAndDropService } from '@app/services/edit-services/drag-and-drop.service';
import { MapService } from '@app/services/edit-services/map.service';
import { ClientHttpRequestsService } from '@app/services/client-http-requests.service';

describe('ItemGridComponent', () => {
    let component: ItemGridComponent;
    let fixture: ComponentFixture<ItemGridComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ItemGridComponent, HttpClientTestingModule],
            providers: [
                DragAndDropService,
                MapService,
                ClientHttpRequestsService,
                provideTippyConfig({
                    defaultVariation: 'tooltip',
                    variations: {
                        tooltip: tooltipVariation,
                        popper: popperVariation,
                    },
                }),
                provideTippyLoader(async () => import('tippy.js')),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ItemGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
