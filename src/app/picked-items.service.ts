import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PickedItemsService {

  pickedItems: any[] = [];
  constructor() { }
  addPickedItem(item: any) {
    this.pickedItems.push(item);
  }

  getPickedItems() {
    return this.pickedItems;
  }
}
