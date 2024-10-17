import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';



interface OrderItem {
  itemName: string;
  partNumber: number;
  quantity: number;
  size: string;
  description: string;
}

interface Order {
  email: string;
  name: string;
  currentDate: string;
  selectedItems: OrderItem[];
}


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
interface PickedItem {
  itemName: string;
  size: string;
  description: string;
  quantity: number;
  pictureUrl: string;
}

@Component({
  selector: 'app-view-picked',
  templateUrl: './view-picked.page.html',
  styleUrls: ['./view-picked.page.scss'],
})
export class ViewPickedPage implements OnInit {
  // productsCollection: AngularFirestoreCollection<PickedItem>;
  // quantity: number;
  // capturedPhotos: any[] = [];
  // pickedItems: PickedItem[] = [];
  // selectedItems: any[] = [];
  orders: Order[] = [];
  inventories: any[] = [];
  data: any;
  capturedPhotos: any[] = [];
  segmentValue: string = 'view';
  products: any[] = []; // Initialize with your delivery data
  expandedItem: any = null;
  selectedQuantity: number = 1;
  selectedSize: string = '';
  sizeOptions: string[] = [];
  quantityOptions: number[] = [];

  constructor(
    private firestore: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) { 

  }

  async ngOnInit() {
    this. fetchInventoriesFromFirestore();
  }


  async fetchInventoriesFromFirestore() {
    const ordersSnapshot = await this.firestore.collection('Orders').get().toPromise();

    this.orders = []; // Clear existing inventories array

    ordersSnapshot.forEach(doc => {
      const orderData = doc.data() as Order;
      this.orders.push(orderData);
    });
  }

  async generatePDF(selectedOrder: Order) {
    const deliverDate=new Date(selectedOrder.currentDate);
    const pickedDate=deliverDate.toLocaleDateString('en-GB',{year:'numeric',month:'2-digit',day:'2-digit'});
    const pickedTime=deliverDate.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    try {
      const docDefinition = {
        content: [
          { text: 'Receipt', style: 'header' },
          { text: 'Items Picker: ' + selectedOrder.name, style: 'subheader' },
          { text: 'Email address: ' + selectedOrder.email },
          { text: 'Current Date: ' + pickedDate+'   '+pickedTime, style: 'subheader' },
          { text: 'Picked Items:', style: 'subheader' },
          selectedOrder.selectedItems.map(item => [
            { text: 'Item Name: ' + item.itemName },
            { text: 'Bar Code: ' + item.partNumber },
            { text: 'Size: ' + item.size },
            { text: 'Quantity: ' + item.quantity },
            { text: 'Description: ' + item.description },
            { text: ' ', style: 'spacer' }
          ])
        ],
        styles: {
          header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
          subheader: { fontSize: 14, bold: true, margin: [0, 5, 0, 5] },
          spacer: { margin: [0, 10] }
        }
      };

      pdfMake.createPdf(docDefinition).download('picker_receipt.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showToast('Error generating PDF');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }


//   async fetchPickedItems() {
//     try {
//       const loading = await this.loadingCtrl.create({
//         message: 'Loading...',
//         spinner: 'crescent',
//         duration: 4000,
//         showBackdrop: true
//       });
//       await loading.present();

//       this.pickedItems = []; // Clear previous data
//       this.firestore.collection('selectedItems').valueChanges().subscribe((data: any[]) => {
//         this.selectedItems = data;
//         this.selectedItems.forEach((delivery:  { capturedPhotosUrl: any; }) => {
//           const imageUrl = delivery.capturedPhotosUrl;
//           if (imageUrl) {
//             // If the image URL exists, add it to capturedPhotos array
//             this.capturedPhotos.push(imageUrl);
//             console.log(imageUrl);
//           }
//         });
//       });

//       await loading.dismiss();
//     } catch (error) {
//       console.error('Error fetching picked items:', error);
//       this.showToast('Error fetching picked items');
//     }
//   }

//   async showToast(message: string) {
//     const toast = await this.toastCtrl.create({
//       message: message,
//       duration: 2000
//     });
//     toast.present();
//   }

//   async updateProductQuantity(item: PickedItem) {
//     try {
//         const { description, itemName, quantity, size } = item;
//         if (quantity) {
//             // Update quantity in products collection by subtracting selected quantity
//             const querySnapshot = await this.productsCollection.ref
//                 .where('itemName', '==', itemName)
//                 .where('description', '==', description)
//                 .where('size', '==', size)
//                 .get();

//             querySnapshot.forEach((doc) => {
//                 const productRef = doc.ref;
//                 const currentQuantity = doc.data().quantity;
//                 if (currentQuantity >= quantity) {
//                     productRef.update({ quantity: currentQuantity - quantity });
//                 } else {
//                     console.error(`Insufficient quantity available for product ${itemName}`);
                    
//                 }
                
//             });
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

// async deleteAllSelectedItems() {
//   try {
//       const batch = this.firestore.firestore.batch();
//       const querySnapshot = await this.firestore.collection('selectedItems').get().toPromise();
//       querySnapshot.forEach((doc) => {
//           const docRef = doc.ref;
//           batch.delete(docRef);
//       });
//       await batch.commit();
//   } catch (error) {
//       console.error('Error deleting selected items:', error);
//   }
// }



// updateQuantity() {
 
//     this.selectedItems.forEach(item => {
//       this.generatePDF(this.selectedItems);
//         this.updateProductQuantity(item);
//     });
  
// }

// async generatePDF(selectedItems) {
//   try {
//     const docDefinition = {
//       content: [
//         { text: 'Delivery Slip', style: 'header' },
//         { text: '====================', style: 'subheader' },
//         { text: ' ', style: 'spacer' }
//       ],
//       styles: {
//         header: { fontSize: 18, bold: true },
//         subheader: { fontSize: 14, bold: true },
//         spacer: { margin: [0, 10] }
//       }
//     };

//     // Iterate over each item in selectedItems
//     selectedItems.forEach(item => {
//       // Convert Firestore timestamp to JavaScript Date object
//       const currentDate = item.current.toDate();
//       const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

//       // Add details of each item to the PDF content
//       docDefinition.content.push(
//         { text: 'Picker Name: ' + item.userName, style: 'body' },
//         { text: 'Picker Email: ' + item.userEmail, style: 'body' },
//         { text: 'Item Name: ' + item.itemName, style: 'body' },
//         { text: 'Quantity: ' + item.quantity, style: 'body' },
//         { text: 'Size: ' + item.size, style: 'body' },
//         { text: 'Description: ' + item.description, style: 'body' },
//         { text: 'Current Date: ' + formattedDate, style: 'body' },
//         { text: '====================', style: 'subheader' },
//         { text: ' ', style: 'spacer' }
//       );
//     });

//     // Create and download the PDF
//     pdfMake.createPdf(docDefinition).download('delivery_slip.pdf');
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     this.showToast('Error generating PDF');
//   }
// }



}
