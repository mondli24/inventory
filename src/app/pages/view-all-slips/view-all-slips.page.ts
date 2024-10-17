import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

interface InventoryItem {
  capturedPhotosUrl: string;
  itemName: string;
  partNumber: number;
  quantity: number;
  size: string;
  description: string;
}

interface Inventory {
  empName: string;
  employeeNumber: string;
  currentDate: string;
  items: InventoryItem[];
}


@Component({
  selector: 'app-view-all-slips',
  templateUrl: './view-all-slips.page.html',
  styleUrls: ['./view-all-slips.page.scss'],
})
export class ViewAllSlipsPage {

  inventories: Inventory[] = [];

  
  constructor(
    private db: AngularFirestore,
    private load: LoadingController,
    private toast: ToastController
  ) {}
  

  async ngOnInit() {
    await this.fetchInventoriesFromFirestore();
    
  }
  

  async fetchInventoriesFromFirestore() {
    
    const inventoriesSnapshot = await this.db.collection('products').get().toPromise();

    this.inventories = []; // Clear existing inventories array

    inventoriesSnapshot.forEach(doc => {
      const inventoryData = doc.data() as Inventory;
      this.inventories.push(inventoryData);
    });
  }

  async generatePDF(selectedInventory: Inventory) {
    const deliverDate=new Date(selectedInventory.currentDate);
    const pickedDate=deliverDate.toLocaleDateString('en-GB',{year:'numeric',month:'2-digit',day:'2-digit'});
    const pickedTime=deliverDate.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    
    try {
      const docDefinition = {
        content: [
          { text: 'Receipt', style: 'header' },
          { text: 'Delivery guy: ' + selectedInventory.empName, style: 'subheader' },
          { text: 'Employee Number: ' + selectedInventory.employeeNumber },
          { text: 'Current Date: ' + pickedDate+'   '+pickedTime, style: 'subheader' },
          { text: 'Inventory Items:', style: 'subheader' },
          selectedInventory.items.map(item => [
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

      pdfMake.createPdf(docDefinition).download('receipt.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showToast('Error generating PDF');
    }
  }


  async showToast(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

  formatDate(timestamp: firebase.default.firestore.Timestamp): string {
    const currentDate = timestamp.toDate();
    return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  }
}
