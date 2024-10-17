import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


interface InventoryItem {
  capturedPhotosUrl: string;
  itemName: string;
  partNumber: number;
  quantity: number;
  size: string;
  description: string;
  // Add other properties if needed
}

interface Inventory {
  empName: string;
  employeeNumber: string;
  currentDate: string;
  items: InventoryItem[];
}
@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.page.html',
  styleUrls: ['./view-inventory.page.scss'],
})
export class ViewInventoryPage  {
 
  
  inventories: any[] = [];
  data: any;
  capturedPhotos: any[] = [];
  segmentValue: string = 'view';
  stock:any[]=[];
  products: any[] = []; // Initialize with your delivery data
  expandedItem: any = null;
  selectedQuantity: number = 1;
  selectedSize: string = '';
  sizeOptions: string[] = [];
  quantityOptions: number[] = [];
  constructor(private firestore: AngularFirestore) {
    this.firestore
    .collection('stock')
    .valueChanges()
    .subscribe((products)=>{
      this.products=products;
      console.log(products);
    });
    this.getAllDocuments();
    // this.fetchInventoriesFromFirestore();
  }
  getAllDocuments() {
    this.firestore.collection('stock').valueChanges('items').subscribe((data: any[]) => {
      this.stock= data;
         
      this.stock.forEach((delivery: { capturedPhotosUrl: any; }) => {
        const imageUrl = delivery.capturedPhotosUrl; // Assuming 'capturedPhotosUrl' is where you store the image URL in Firestore
        if (imageUrl) {
          // If the image URL exists, add it to capturedPhotos array
          this.capturedPhotos.push(imageUrl);
          console.log(imageUrl)
        }
      });
    });
  }
  // async fetchInventoriesFromFirestore() {
  //   const inventoriesSnapshot = await this.firestore.collection('products').get().toPromise();

  //   this.inventories = []; // Clear existing inventories array

  //   inventoriesSnapshot.forEach(doc => {
  //     const inventoryData = doc.data() as Inventory; // Cast the data to Inventory type
  //     this.inventories.push(inventoryData);
  //   });
  // }
}
