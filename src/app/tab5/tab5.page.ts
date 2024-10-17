import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { collection, addDoc } from 'firebase/firestore';
import { Firestore, getFirestore } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController,ToastController } from '@ionic/angular';


@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  isLoading: boolean = false;
  currentDate: Date = new Date();
  employeeNumber:string;
  empName:string;
  companyName:string;
  contactNo:string;
  current:string;
  url: any;

  phonePattern: RegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

  //Item details
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
    private load: LoadingController,
    private toast: ToastController
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

  
  async submit() {
    this.showLoader();
    try {
        // Show loader here
        // Upload image
        const imageUrl = await this.uploadImage(this.previewImage);
        let loader = this.load.create({
          message: "Loading...",
           spinner: 'crescent',
          duration: 4000,
          showBackdrop: true,

        });
        (await (loader)).present();
        // Check if imageSource is undefined
        if (!this.imageSource) {
            console.error("Image source is undefined.");
            return;
        }

        // Set data in Firestore
        const newNoteRef = this.db.collection('products').doc();
        await newNoteRef.set({
            itemName: this.itemName,
            quantity: this.quantity,
            size: this.size,
            description: this.description,
            // employeeNumber: this.employeeNumber,
            // empName: this.empName,
            // companyName: this.companyName,
            // contactNo: this.contactNo,
            capturedPhotosUrl: imageUrl,
            current: this.currentDate
        });

        console.log('Uploaded successfully!');
        (await loader).dismiss();
        this.showToast("Uploaded successfully!");
        // Clear fields after successful upload
        this.clearFields();
    } catch (error) {
        console.error("error: " + error);
    } finally {
        // Hide loader here
        this.hideLoader();
    }
}

showToast(message: string) {
  this.toast.create({
    message: message,
    duration: 4000
  }).then(toastData => toastData.present());
}

showLoader() {
   
    this.isLoading = true; 
}

hideLoader() {
   
    this.isLoading = false;
}

validatePhoneNumber(): boolean {
  return this.phonePattern.test(this.contactNo);
}

done(){

  try{
    this.showLoader();
    let loader = this.load.create({
      message: "Loading...",
       spinner: 'crescent',
      duration: 4000,
      showBackdrop: true,
      
    });
  }catch{

  }


}
allInputsFilled(): boolean {
  return !!this.itemName && !!this.quantity && !!this.size && !!this.description && !!this.imageSource;
}

clearFields() {
  this.itemName = '';
  this.quantity = null;
  this.size = '';
  this.description = '';
  this.imageSource='';
}
}