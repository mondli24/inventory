import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';



@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page {
  showFirstContent: boolean = true;
  somethingClicked: boolean = false;
  data: any;
  capturedPhotos: any[] = [];
  segmentValue: string = 'view';
  products: any[] = []; // Initialize with your delivery data
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
  
  pickItem(delivery: any) {
    this. showSecondContent();
    // Implement your logic here, such as marking the item as picked or performing any other actions
    console.log('Picking item:', delivery);
    // Example: Change the background color of the picked item
    delivery.isPicked = true;
  }
  

  showSecondContent() {
    this.showFirstContent = false;
  }

  showFirstContentAgain() {
    this.showFirstContent = true;
  }

  
}
