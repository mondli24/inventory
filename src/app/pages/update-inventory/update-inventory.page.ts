import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';


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
  selector: 'app-update-inventory',
  templateUrl: './update-inventory.page.html',
  styleUrls: ['./update-inventory.page.scss'],
})
export class UpdateInventoryPage   {
  stock:any[]=[];
  inventories: any[] = [];
  showFirstContent: boolean = true;
  somethingClicked: boolean = false;
  selectedDelivery: any;
  data: any;
  capturedPhotos: any[] = [];
  segmentValue: string = 'view';
  products: any[] = []; // Initialize with your delivery data
  expandedItem: any = null;
  selectedQuantity: number = 1;
  selectedSize: string = '';
  sizeOptions: string[] = [];
  quantityOptions: number[] = [];
  itemName: any;

  constructor(private firestore: AngularFirestore,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
   
    this.getAllDocuments();

  }

  getAllDocuments() {
    this.firestore.collection('stock').valueChanges().subscribe((data: any[]) => {
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
  

 
  pickItem(delivery: any) {
    this.selectedDelivery = delivery; // Set the selected delivery
    this.showFirstContent = false; // Hide the first content and show the second
  }
  

  showSecondContent() {
    this.showFirstContent = false;
  }

  showFirstContentAgain() {
    this.showFirstContent = true;
  }

  
  async submitQuantity() {
    const loading = await this.loadingController.create({
      message: 'Updating product...',
      spinner: 'dots' // Choose the spinner style here
    });
    await loading.present();
  
    try {
      const querySnapshot = await this.firestore.collection('stock')
        .ref
        .where('partNumber', '==', this.selectedDelivery.partNumber)
        .get();
  
      const promises = querySnapshot.docs.map(async (doc) => {
        // Update each document with the new quantity
        await doc.ref.update({
          itemName: this.selectedDelivery.itemName,
          size: this.selectedDelivery.size,
          description: this.selectedDelivery.description,
          quantity: this.selectedDelivery.quantity,
        });
      });
  
      await Promise.all(promises);
  
      // Dismiss the loader
      await loading.dismiss();
  
      // Show a success toast
      const toast = await this.toastController.create({
        message: 'Product updated successfully!',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
  
      this.showFirstContent = true;
    } catch (error) {
      console.error('Error updating product:', error);
  
      // Dismiss the loader
      await loading.dismiss();
  
      // Show an error toast
      const toast = await this.toastController.create({
        message: 'Error updating product',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }
  
  }

