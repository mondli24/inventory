import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})

export class ManagerPage{
  @ViewChild('tabs', {static: false}) tabs: IonTabs;
  selectedTab: any;
  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
    console.log(this.selectedTab);
  }

  userDocument: any;
  
  constructor(
  private alertController: AlertController,
  private router: Router,private navCtrl: NavController,
  private auth: AngularFireAuth,
  private db: AngularFirestore,
  private toastController: ToastController
  ) {}


  async getUser(): Promise<void> {
    try {
      const user = await this.auth.currentUser;

      if (user) {
        const querySnapshot = await this.db
          .collection('Users', ref => ref.where('email', '==', user.email))
          .valueChanges({ idField: 'id' })
          .pipe(first())
          .toPromise();

        if (querySnapshot && querySnapshot.length > 0) {
          this.userDocument = querySnapshot[0];
          console.log('User Document:', this.userDocument); // Log user document
        }
      }
    } catch (error) {
      console.error('Error getting user document:', error);
      throw error; // Rethrow error for better error handling
    }
  }

  
  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Logout canceled');
          }
        }, {
          text: 'Yes',
          handler: () => {
            // Perform logout action here
            console.log('Perform logout');
            // Redirect to login page
            this.router.navigateByUrl('/login'); // Replace '/login' with your actual login page route
          }
        }
      ]
    });
  
    await alert.present();
  }
  

}
