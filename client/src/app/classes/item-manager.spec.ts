import { ItemManager } from '@app/classes/item-manager';

/* eslint-disable */
describe('ItemManager', () => {
    let itemManager: ItemManager;

    beforeEach(() => {
        itemManager = new ItemManager(10, 'Classic');
    });

    it('should initialize with correct default item amounts', () => {
        expect(itemManager.itemAmounts['attributeItem1']).toBe(1);
        expect(itemManager.itemAmounts['conditionItem1']).toBe(1);
        expect(itemManager.itemAmounts['gameplayItem1']).toBe(1);
        expect(itemManager.itemAmounts['attributeItem2']).toBe(1);
        expect(itemManager.itemAmounts['conditionItem2']).toBe(1);
        expect(itemManager.itemAmounts['gameplayItem2']).toBe(1);
        expect(itemManager.itemAmounts['spawnpoint']).toBe(2);
        expect(itemManager.itemAmounts['randomItem']).toBe(2);
        expect(itemManager.itemAmounts['flag']).toBe(0);
    });

    it("Should have a flag if game mode is 'CTF'", () => {
        itemManager = new ItemManager(10, 'CTF');
        expect(itemManager.itemAmounts['flag']).toBe(1);
    });

    it('should increase the amount of an existing item', () => {
        const initialAmount = itemManager.itemAmounts['attributeItem1'];
        itemManager.increaseItemAmount('attributeItem1');
        expect(itemManager.itemAmounts['attributeItem1']).toBe(initialAmount + 1);
    });

    it('should decrease the amount of an existing item', () => {
        const initialAmount = itemManager.itemAmounts['conditionItem1'];
        itemManager.decreaseItemAmount('conditionItem1');
        expect(itemManager.itemAmounts['conditionItem1']).toBe(initialAmount - 1);
    });

    it('should return correct item amount for spawnpoint based on map size', () => {
        expect(itemManager.getDefaultItemAmount('spawnpoint')).toBe(2);

        itemManager = new ItemManager(15, 'Classic');
        expect(itemManager.getDefaultItemAmount('spawnpoint')).toBe(4);

        itemManager = new ItemManager(20, 'Classic');
        expect(itemManager.getDefaultItemAmount('spawnpoint')).toBe(6);
    });

    it('should return correct item amount for randomItem based on map size', () => {
        expect(itemManager.getDefaultItemAmount('randomItem')).toBe(2);

        itemManager = new ItemManager(15, 'Classic');
        expect(itemManager.getDefaultItemAmount('randomItem')).toBe(4);

        itemManager = new ItemManager(20, 'Classic');
        expect(itemManager.getDefaultItemAmount('randomItem')).toBe(6);
    });

    it('should return 0 for unknown item types', () => {
        expect(itemManager.getDefaultItemAmount('unknownItem')).toBe(0);
    });

    it('should set default item amounts correctly', () => {
        itemManager.itemAmounts = {};
        itemManager.setDefaultItemAmounts();

        expect(itemManager.itemAmounts['attributeItem1']).toBe(1);
        expect(itemManager.itemAmounts['conditionItem1']).toBe(1);
        expect(itemManager.itemAmounts['gameplayItem1']).toBe(1);
        expect(itemManager.itemAmounts['attributeItem2']).toBe(1);
        expect(itemManager.itemAmounts['conditionItem2']).toBe(1);
        expect(itemManager.itemAmounts['gameplayItem2']).toBe(1);
        expect(itemManager.itemAmounts['spawnpoint']).toBe(2);
        expect(itemManager.itemAmounts['randomItem']).toBe(2);
        expect(itemManager.itemAmounts['flag']).toBe(0);
    });

    it('should get correct item amounts for all item types', () => {
        expect(itemManager.getDefaultItemAmount('attributeItem1')).toBe(1);
        expect(itemManager.getDefaultItemAmount('conditionItem1')).toBe(1);
        expect(itemManager.getDefaultItemAmount('gameplayItem1')).toBe(1);
        expect(itemManager.getDefaultItemAmount('attributeItem2')).toBe(1);
        expect(itemManager.getDefaultItemAmount('conditionItem2')).toBe(1);
        expect(itemManager.getDefaultItemAmount('gameplayItem2')).toBe(1);
        expect(itemManager.getDefaultItemAmount('spawnpoint')).toBe(2);
        expect(itemManager.getDefaultItemAmount('randomItem')).toBe(2);
        expect(itemManager.getDefaultItemAmount('flag')).toBe(0);
    });

    it('should not allow negative values when decreasing item amount', () => {
        itemManager.itemAmounts['attributeItem1'] = 0;
        itemManager.decreaseItemAmount('attributeItem1');
        expect(itemManager.itemAmounts['attributeItem1']).toBe(0);
    });
});
