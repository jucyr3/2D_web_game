import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';

@Injectable({
  providedIn: 'root'
})
export class ItemFactoryService {

  createItem(itemName: string): {itemObject: ItemObject, itemAmount: number} {
    return {
      itemObject: new ItemObject(itemName),
      itemAmount: 1
    }
  }
}
