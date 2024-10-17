import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Route, NavigationExtras, Router } from '@angular/router';
import * as firebase from 'firebase/compat';
import { getAuth } from 'firebase/auth';
import { User } from 'src/app/models/user.mode';
import { collection, getDocs, getFirestore, query, where } from '@firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
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

interface Product {
  quantity: number;
  capturedPhotosUrl: string;
  itemName: string;
  partNumber: number;
  size: string;
  description: string;
}

@Component({
  selector: 'app-pick',
  templateUrl: './pick.page.html',
  styleUrls: ['./pick.page.scss'],
})
export class PickPage implements OnInit {
  stockCollection: AngularFirestoreCollection<Product>;
  stock:any[]=[];
  inventories: any[] = [];
  buttonClicked: boolean = false;
  currentDate: Date = new Date();
  showFirstContent: boolean = true;
  somethingClicked: boolean = false;
  // data: any;
  quantity:number;
  capturedPhotos: any[] = [];
  selectedItems:any[]=[];
  segmentValue: string = 'view';
  products: any[] = []; // Initialize with your delivery data
  selectedQuantity: number = 1;
  selectedSize: string = '';
  sizeOptions: string[] = [];
  quantityOptions: number[] = [];
  orders = [];
  selectedDelivery: any;
  current:string;
  name:string|any;
  surname: string|any;
  email:string|any;

  constructor(private firestore: AngularFirestore,   private fauth:AngularFireAuth,  private router: Router,
    private toastController: ToastController, private loadingController: LoadingController
  ) {

    this.stockCollection = this.firestore.collection<Product>('stock');
    this.firestore
    .collection('stock')
    .valueChanges()
    .subscribe((selectedItems)=>{
      this.selectedItems=selectedItems;
      console.log(selectedItems);
    });
    this.getAllDocuments();
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnInit() {
    this.fauth.authState.subscribe(user => {
      if (user) {
        console.log('user: ', user.email)
        this.email = user.email;
        this.retrieveData();
      }
    });
  }

  user={}as User;
  
  retrieveData() {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', this.email));
    getDocs(q)
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          this.name = data['name'];
          this.surname = data['surname'];
          this.email = data['email'];
        } else {
          console.log('No data found for the user');
        }
      })
      .catch((error: any) => {
        console.error('Error retrieving data from Firestore: ', error);
      });
  }

  getAllDocuments() {
    this.firestore.collection('stock').valueChanges('items').subscribe((data: any[]) => {
      this.stock= data;
         
      this.stock.forEach((delivery: { capturedPhotosUrl: any; quantity: any }) => {
        const imageUrl = delivery.capturedPhotosUrl; // Assuming 'capturedPhotosUrl' is where you store the image URL in Firestore
        if (imageUrl) {
          // If the image URL exists, add it to capturedPhotos array
          this.capturedPhotos.push(imageUrl);
          console.log(imageUrl)
        }
        // Initialize quantity to null or undefined instead of a default value
        delivery.quantity = null; // or undefined
      });
      console.log('stock'+this.stock);
    });
  }
  
  showSecondContent() {
    this.showFirstContent = false;
  }

  showFirstContentAgain() {
    this.showFirstContent = true;
  }

  submitQuantity() {
    // Get current date
    const currentDate = new Date();
    
    // Here you can perform any actions you need when the user submits the quantity
    console.log('Submitted quantity:', this.selectedDelivery.quantity);
    this.showFirstContent = true;

    // Store selected item details in an object
    const selectedItem = {
        itemName: this.selectedDelivery.itemName,
        size: this.selectedDelivery.size,
        description: this.selectedDelivery.description,
        quantity: this.selectedDelivery.quantity,
        capturedPhotosUrl: this.selectedDelivery.capturedPhotosUrl,
        // Include user's email for identification
    };

    // Create an object to encapsulate selected items along with user details
    const order = {
        currentDate: this.currentDate,
        name: this.name,
        surname: this.surname,
        email: this.email,
        selectedItems: [selectedItem] // Start with an array containing the first selected item
    };
    this.orders.push(order);

    console.log('Orders:', this.orders);

    // Reset selected item and quantity
    this.selectedDelivery = null;
    this.quantity = null;

    // Show first content again
    this.showFirstContent = true;
}

// Initialize selectedItems array in data property
data() {
    return {
        selectedItems: []
    }
}


// Function to show toaster message
showToast(message) {
    // Implement your toaster functionality here
    console.log('Toaster:', message);
}




toggleInput(delivery: any) {
  const currentDate = new Date();
  delivery.showInput = !delivery.showInput;

  // Check if delivery is selected and quantity is truthy
  if (delivery.selected && delivery.quantity) {
    const selectedItem = {
      itemName: delivery.itemName,
      partNumber: delivery.partNumber,
      size: delivery.size,
      description: delivery.description,
      quantity: delivery.quantity,
      capturedPhotosUrl: delivery.capturedPhotosUrl,
    };

    let order = this.orders.find(o => o.email === this.email);

    if (!order) {
      order = {
        currentDate: currentDate.toISOString(),
        name: this.name,
        email: this.email,
        selectedItems: [] 
      };
      this.orders.push(order); 
    }
    order.selectedItems.push(selectedItem);
    console.log('Orders:', this.orders);
  } else {
    // If quantity is not entered, disable the checkbox
    delivery.selected = false;
  }
}

async addOrdersToFirestore(orders) {
  const loading = await this.loadingController.create({
    message: 'Processing...',
    spinner: 'crescent' // Choose the spinner style here
  });
  await loading.present();

  try {
    for (const order of orders) {
      for (const selectedItem of order.selectedItems) {
        const querySnapshot = await this.stockCollection.ref
          .where('partNumber', '==', selectedItem.partNumber)
          .get();

        let sufficientQuantity = true; // Flag to track if there is enough quantity
        querySnapshot.forEach((doc: QueryDocumentSnapshot<Product>) => {
          const currentQuantity = doc.data().quantity;
          if (currentQuantity < selectedItem.quantity) {
            // If quantity is insufficient, set flag to false and exit loop
            sufficientQuantity = false;
            return;
          }
        });

        if (!sufficientQuantity) {
          // If quantity is insufficient, display toast and exit function
          const toast = await this.toastController.create({
            message: `Insufficient quantity available for product ${selectedItem.itemName}`,
            duration: 2000,
            position: 'bottom',
            color: 'danger'
          });
          await toast.present();
          // Dismiss the loader
          await loading.dismiss();
          return; // Exit function
        }

        // If quantity is sufficient, proceed with updating stock quantities
        for (const doc of querySnapshot.docs) {
          const productRef = doc.ref;
          const currentQuantity = doc.data().quantity;
          productRef.update({ quantity: currentQuantity - selectedItem.quantity });
          console.log(`Quantity updated for ${selectedItem.itemName}`);
        }
      }
    }

    // After updating stock quantities, add orders to Firestore
    const ordersCollection = this.firestore.collection('Orders');
    await Promise.all(orders.map(async (order) => {
      try {
        const docRef = await ordersCollection.add(order);
        console.log('Order added with ID: ', docRef.id);
      } catch (error) {
        console.error('Error adding order: ', error);
      }
    }));

    // Dismiss the loader
    await loading.dismiss();

    // Show a success toast
    const toast = await this.toastController.create({
      message: 'Picked successfully!',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();

    // Navigate to '/manager' route
    this.router.navigateByUrl('/picker');
  } catch (error) {
    console.error('Error updating quantity:', error);

    // Dismiss the loader
    await loading.dismiss();

    // Show an error toast
    const toast = await this.toastController.create({
      message: 'Error processing order',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}

}
