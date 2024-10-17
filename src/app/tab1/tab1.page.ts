import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
 
  data: any;
  capturedPhotos: any[] = [];
  segmentValue: string = 'view';
  products: any[] = []; // Initialize with your delivery data
  expandedItem: any = null;
  selectedQuantity: number = 1;
  selectedSize: string = '';
  sizeOptions: string[] = [];
  quantityOptions: number[] = [];
  constructor(private firestore: AngularFirestore) {
    this.firestore
    .collection('products')
    .valueChanges()
    .subscribe((products)=>{
      this.products=products;
      console.log(products);
    });
    this.getAllDocuments();

  }
  getAllDocuments() {
    this.firestore.collection('products').valueChanges().subscribe((data: any[]) => {
      this.products= data;
      this.products.forEach((delivery: { capturedPhotosUrl: any; }) => {
        const imageUrl = delivery.capturedPhotosUrl; // Assuming 'capturedPhotosUrl' is where you store the image URL in Firestore
        if (imageUrl) {
          // If the image URL exists, add it to capturedPhotos array
          this.capturedPhotos.push(imageUrl);
          console.log(imageUrl)
        }
      });
    });
  }
 

}
