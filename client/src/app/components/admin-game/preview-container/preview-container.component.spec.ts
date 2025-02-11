import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewContainerComponent } from './preview-container.component';
import { Map } from '@common/map';
import { Tile } from '@common/tile';

describe('PreviewContainerComponent', () => {
    let component: PreviewContainerComponent;
    let fixture: ComponentFixture<PreviewContainerComponent>;

    const mockMap: Map = {
        mapId: 1,
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test Description',
        gameMode: 'Classic',
        tileMatrix: [] as Tile[][],
        lastModified: new Date(),
        previewImage: 'base64string',
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PreviewContainerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PreviewContainerComponent);
        component = fixture.componentInstance;
        component.map = mockMap;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show description on mouseenter', () => {
        spyOn(component.selectedMapChange, 'emit');
        const container = fixture.debugElement.nativeElement.querySelector('.preview-container');

        container.dispatchEvent(new MouseEvent('mouseenter'));

        expect(component.selectedMapChange.emit).toHaveBeenCalledWith(mockMap);
    });

    it('should hide description on mouseleave', () => {
        spyOn(component.selectedMapChange, 'emit');
        const container = fixture.debugElement.nativeElement.querySelector('.preview-container');

        container.dispatchEvent(new MouseEvent('mouseleave'));

        expect(component.selectedMapChange.emit).toHaveBeenCalledWith(null);
    });

    it('should display image when previewImage exists', () => {
        const img = fixture.debugElement.nativeElement.querySelector('img');

        expect(img).toBeTruthy();
        expect(img.src).toContain('base64string');
        expect(img.alt).toBe('Test Map');
    });

    it('should show description overlay when map is selected', () => {
        component.selectedMap = mockMap;
        fixture.detectChanges();

        const overlay = fixture.debugElement.nativeElement.querySelector('.description-overlay');

        expect(overlay).toBeTruthy();
        expect(overlay.textContent.trim()).toBe('Test Description');
    });

    it('should not show description overlay when map is not selected', () => {
        component.selectedMap = null;
        fixture.detectChanges();

        const overlay = fixture.debugElement.nativeElement.querySelector('.description-overlay');

        expect(overlay).toBeFalsy();
    });
});
