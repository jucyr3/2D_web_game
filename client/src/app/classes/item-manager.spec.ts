import { ItemManager } from '@app/classes/item-manager'; // Adjust the import path as needed

describe('ItemManager', () => {
    let itemManager: ItemManager;

    beforeEach(() => {
        itemManager = new ItemManager(10);
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
        expect(itemManager.itemAmounts['flag']).toBe(1);
    });

    it('should increase the amount of an existing item', () => {
        const initialAmount = itemManager.itemAmounts['attributeItem1'];
        itemManager.increaseItemAmount('attributeItem1');
        expect(itemManager.itemAmounts['attributeItem1']).toBe(initialAmount + 1);
    });

    it('should create and increase the amount of a new item', () => {
        itemManager.increaseItemAmount('newItem');
        expect(itemManager.itemAmounts['newItem']).toBe(1);
    });

    it('should decrease the amount of an existing item', () => {
        const initialAmount = itemManager.itemAmounts['conditionItem1'];
        itemManager.decreaseItemAmount('conditionItem1');
        expect(itemManager.itemAmounts['conditionItem1']).toBe(initialAmount - 1);
    });

    it('should handle decreasing the amount of a non-existent item', () => {
        itemManager.decreaseItemAmount('nonExistentItem');
        expect(itemManager.itemAmounts['nonExistentItem']).toBe(NaN);
    });

    it('should return correct item amount for spawnpoint based on map size', () => {
        expect(itemManager.getItemAmount('spawnpoint')).toBe(2);

        itemManager = new ItemManager(15);
        expect(itemManager.getItemAmount('spawnpoint')).toBe(4);

        itemManager = new ItemManager(20);
        expect(itemManager.getItemAmount('spawnpoint')).toBe(6);
    });

    it('should return correct item amount for randomItem based on map size', () => {
        expect(itemManager.getItemAmount('randomItem')).toBe(2);

        itemManager = new ItemManager(15);
        expect(itemManager.getItemAmount('randomItem')).toBe(4);

        itemManager = new ItemManager(20);
        expect(itemManager.getItemAmount('randomItem')).toBe(6);
    });

    it('should return 0 for unknown item types', () => {
        expect(itemManager.getItemAmount('unknownItem')).toBe(0);
    });

    it('should set default item amounts correctly', () => {
        itemManager.itemAmounts = {}; // Clear the item amounts
        itemManager.setDefaultItemAmounts();

        expect(itemManager.itemAmounts['attributeItem1']).toBe(1);
        expect(itemManager.itemAmounts['conditionItem1']).toBe(1);
        expect(itemManager.itemAmounts['gameplayItem1']).toBe(1);
        expect(itemManager.itemAmounts['attributeItem2']).toBe(1);
        expect(itemManager.itemAmounts['conditionItem2']).toBe(1);
        expect(itemManager.itemAmounts['gameplayItem2']).toBe(1);
        expect(itemManager.itemAmounts['spawnpoint']).toBe(2);
        expect(itemManager.itemAmounts['randomItem']).toBe(2);
        expect(itemManager.itemAmounts['flag']).toBe(1);
    });

    it('should get correct item amounts for all item types', () => {
        expect(itemManager.getItemAmount('attributeItem1')).toBe(1);
        expect(itemManager.getItemAmount('conditionItem1')).toBe(1);
        expect(itemManager.getItemAmount('gameplayItem1')).toBe(1);
        expect(itemManager.getItemAmount('attributeItem2')).toBe(1);
        expect(itemManager.getItemAmount('conditionItem2')).toBe(1);
        expect(itemManager.getItemAmount('gameplayItem2')).toBe(1);
        expect(itemManager.getItemAmount('spawnpoint')).toBe(2);
        expect(itemManager.getItemAmount('randomItem')).toBe(2);
        expect(itemManager.getItemAmount('flag')).toBe(1);
    });
});
