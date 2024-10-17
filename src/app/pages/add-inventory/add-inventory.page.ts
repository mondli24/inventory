
  import { Component, OnInit } from '@angular/core';
  import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
  import { AngularFireStorage } from '@angular/fire/compat/storage';
  import { DomSanitizer } from '@angular/platform-browser';
  import { collection, addDoc } from 'firebase/firestore';
  import { Firestore, getFirestore } from 'firebase/firestore';
  import { AngularFirestore } from '@angular/fire/compat/firestore';
  import { LoadingController,ToastController } from '@ionic/angular';
  import * as pdfMake from 'pdfmake/build/pdfmake';
  import { Router } from '@angular/router';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';



(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  
  @Component({
    selector: 'app-add-inventory',
    templateUrl: './add-inventory.page.html',
    styleUrls: ['./add-inventory.page.scss'],
  })
  export class AddInventoryPage{
  
    isLoading: boolean = false;
    currentDate: Date = new Date();
    employeeNumber:number;
    empName:string;
    companyName:string;
    contactNo:string;
    current:firebase.default.firestore.Timestamp;
    url: any;
    inventories: any[] = [];
    
  
    phonePattern: RegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  
    //Item details
    barCode:string;
    itemName: string;
    quantity: number;
    size: string;
    description: string;
    previewImage:any;
    imageSource:any;
  
    constructor(
      private db: AngularFirestore,
      private storage: AngularFireStorage,
      private domSantitizer:DomSanitizer,
      private firestore: AngularFirestore,
      private loadingController: LoadingController,
      private toastController: ToastController,
      private router: Router
    ) {
  
      setInterval(() => {
        this.currentDate = new Date();
      }, 1000);
    }
    
    ngOnInit() {
    }
    async takePhoto() {
      const image: Photo = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 90,
      });
  
      this.previewImage = `data:image/jpeg;base64,${image.base64String}`;
    
      this.imageSource=this.domSantitizer.bypassSecurityTrustUrl(image.webPath ? image.webPath:"")
    }
    async uploadImage(file: string) {
      const fileName = Date.now().toString();
      const filePath = `images/${fileName}`;
      const fileRef = this.storage.ref(filePath);
  
      const uploadTask = fileRef.putString(file, 'data_url', {
        contentType: 'image/jpeg',
      });
      const snapshot = await uploadTask;
  
      return snapshot.ref.getDownloadURL();
    }
  
  
  showToast(message: string) {
    this.toastController.create({
      message: message,
      duration: 4000
    }).then(toastData => toastData.present());
  }


  
  async submit() {
    const loading = await this.loadingController.create({
        message: 'Submitting item...',
        spinner: 'circles' // Choose the spinner style here
    });
    await loading.present();

    try {
        const currentDate = new Date();
        const partNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        const imageUrl = await this.uploadImage(this.previewImage);
        if (!this.imageSource) {
            console.error("Image source is undefined.");
            // Hide loader if an error occurs
            await loading.dismiss();
            return;
        }

        const newItem = {
            partNumber: partNumber,
            capturedPhotosUrl: imageUrl,
            itemName: this.itemName,
            quantity: this.quantity,
            size: this.size,
            description: this.description,
        };

        let inventory = this.inventories.find(inv => inv.employeeNumber === this.employeeNumber);
        if (!inventory) {
            inventory = {
                empName: this.empName,
                employeeNumber: this.employeeNumber,
                currentDate: currentDate.toISOString(),
                items: []
            };
            this.inventories.push(inventory);
        }

        inventory.items.push(newItem);
        console.log('Inventories:', this.inventories);

        this.clearFields();

        await this.showToast("Item submitted successfully");
    } catch (error) {
        console.error('Error submitting item:', error);
        // Handle error and show error toast if needed
    } finally {
        // Dismiss the loader in any case
        await loading.dismiss();
    }
}

// Disable submit button if any of the required fields are empty
submitDisabled(): boolean {
    return !this.allInputsFilled();
}

async addOrdersToFirestore(inventories) {
  const productsCollection = this.firestore.collection('products');
  const stockCollection = this.firestore.collection('stock');

  const loading = await this.loadingController.create({
      message: 'Processing orders...',
      spinner: 'circles' // Choose the spinner style here
  });
  await loading.present();

  try {
      for (const inventory of inventories) {
          // Add inventory to Products collection
          const docRef = await productsCollection.add(inventory);
          console.log('Inventory added to Products with ID: ', docRef.id);

          // Upload items to Stock collection
          for (const newItem of inventory.items) {
              await stockCollection.add(newItem);
              console.log('New item added to Stock');
          }
      }

      // Show success toast
      const toast = await this.toastController.create({
          message: 'Inventory added successfully',
          duration: 2000, // Toast will be shown for 2 seconds
          position: 'bottom'
      });
      await toast.present();

      // Navigate to manager page
       // Replace '/manager' with your actual manager page route
  } catch (error) {
      console.error('Error adding orders:', error);

      // Show error toast
      const toast = await this.toastController.create({
          message: 'Error adding orders',
          duration: 2000,
          position: 'bottom',
          color: 'danger' // You can set the color to indicate an error
      });
      await toast.present();
  } finally {
      // Dismiss the loader in any case
      await loading.dismiss();
      this.router.navigate(['/manager']);
  }
 
}


  
  
  validatePhoneNumber(): boolean {
    return this.phonePattern.test(this.contactNo);
  }
  
    
  allInputsFilled(): boolean {
    return !!this.itemName && !!this.quantity && !!this.size && !!this.description && !!this.imageSource &&
          !!this.employeeNumber && !!this.empName&& !!this.contactNo;
  }
  
  clearFields() {
    this.itemName = '';
    this.quantity = null;
    this.size = '';
    this.description = '';
    // this.barCode='';
    this.imageSource='';
  }

 
}