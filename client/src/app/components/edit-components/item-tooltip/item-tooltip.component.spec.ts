import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemTooltipComponent } from './item-tooltip.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ItemObject } from '@common/ItemObject';
import { TIPPY_REF } from '@ngneat/helipopper';
import { itemDescriptions } from 'src/assets/items/item-descriptions';

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

    it('should return item name from itemDescriptions', () => {
        const testItem = { name: 'testItem' } as ItemObject;
        component.itemObject = testItem;
        itemDescriptions['testItem'] = { name: 'Test Item', description: '' };
        expect(component.itemName).toBe('Test Item');
    });

    it('should return empty string for itemName when itemObject is null', () => {
        component.itemObject = null;
        expect(component.itemName).toBe('');
    });

    it('should have tippy reference defined', () => {
        expect(component.tippy).toBeDefined();
    });

    it('should return empty string for itemDescription when itemObject is null', () => {
        component.itemObject = null;
        expect(component.itemDescription).toBe('');
    });

    it('should sanitize and highlight words in itemDescription', () => {
        const testItem = { name: 'testItem' } as ItemObject;
        component.itemObject = testItem;
        itemDescriptions['testItem'] = { name: 'Test Item', description: 'This is a rare item with damage and health.' };
        
        component.itemDescription;

        expect(sanitizerSpy.bypassSecurityTrustHtml).toHaveBeenCalledWith(
            'This is a <span style="color: #007bff; font-weight: bold;">rare</span> item with ' +
            '<span style="color: #dc3545; font-weight: bold;">damage</span> and ' +
            '<span style="color: #28a745; font-weight: bold;">health</span>.'
        );
    });
});
