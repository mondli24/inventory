import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  deliveries: any[] = []; // Initialize with your delivery data
  expandedItem: any = null;
  selectedQuantity: number = 1;
  selectedSize: string = '';
  sizeOptions: string[] = [];
  quantityOptions: number[] = [];
  constructor(private firestore: AngularFirestore) {
    this.firestore
    .collection('deliveries')
    .valueChanges()
    .subscribe((deliveries)=>{
      this.deliveries=deliveries;
      console.log(deliveries);
    });

  }
  
  expandItem(item: any) {
    this.expandedItem = item;
    // Hide other items
    this.deliveries.forEach(delivery => {
      if (delivery !== item) {
        delivery.isHidden = true;
      }
    });
  }

  collapseItem() {
    // Show all items
    this.deliveries.forEach(delivery => {
      delivery.isHidden = false;
    });
    this.expandedItem = null;
    // Reset selected quantity and size
    this.selectedQuantity = 1;
    this.selectedSize = '';
  }

  fetchSizeOptions() {
    this.sizeOptions = [];
    this.deliveries.forEach(delivery => {
      if (delivery.size && !this.sizeOptions.includes(delivery.size)) {
        this.sizeOptions.push(delivery.size);
      }
    });
  }

  fetchQuantityOptions() {
    this.firestore.collection('quantities').valueChanges().subscribe((quantities: number[]) => {
      this.quantityOptions = quantities;
    });
  }
}

