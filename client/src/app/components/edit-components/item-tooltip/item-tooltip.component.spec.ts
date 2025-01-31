import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemTooltipComponent } from './item-tooltip.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ItemObject } from '@common/ItemObject';
import { TIPPY_REF } from '@ngneat/helipopper';

describe('ItemTooltipComponent', () => {
    let component: ItemTooltipComponent;
    let fixture: ComponentFixture<ItemTooltipComponent>;
    let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

    beforeEach(async () => {
        sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);

        await TestBed.configureTestingModule({
            imports: [ItemTooltipComponent],
            providers: [
                { provide: DomSanitizer, useValue: sanitizerSpy },
                { provide: TIPPY_REF, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ItemTooltipComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should capitalize the first letter of item name', () => {
        component.itemObject = { name: 'test item' } as ItemObject;
        expect(component.itemName).toBe('Test item');
    });

    it('should return empty string for itemName when itemObject is null', () => {
        component.itemObject = null;
        expect(component.itemName).toBe('');
    });

    it('should have tippy reference defined', () => {
        expect(component.tippy).toBeDefined();
    });
});
