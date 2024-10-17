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
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']

})
export class TabsPage {
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

  async navigateBasedOnRole(tabs: string): Promise<void> {
    try {
      await this.getUser();

      let authorized = false;
      let message = '';

      if (this.userDocument && this.userDocument.role) {
        console.log('User Role:', this.userDocument.role); // Log user role
    
        switch (tabs) {
            case '':
                authorized = this.userDocument.role === 'picker' || this.userDocument.role === 'Manager';
                message = authorized ? 'Authorized user for picker page.' : 'Unauthorized user for picker page.';
                break;
            case 'analytics':
                authorized = this.userDocument.role === 'Delivery' || this.userDocument.role === 'Manager';
                message = authorized ? 'Authorized user for delivery page.' : 'Unauthorized user for delivery page.';
                break;


            case 'view':
                authorized = this.userDocument.role === 'Manager';
                message = authorized ? 'Authorized user for this page.' : 'Access denied for this page.';
                break;


            case 'tabs/tab2':
                  authorized = this.userDocument.role === 'Manager';
                  message = authorized ? 'Authorized user for this page.' : 'Access denied for this page.';
                  break;
            case 'view':
                authorized = this.userDocument.role === 'Manager';
                message = authorized ? 'Authorized user for this page.' : 'Access denied for this page.';
                break;
            default:
                authorized = false;
                message = 'Invalid page.';
                break;
        }
    } else {
        authorized = false;
        message = 'User document or role not found.';
    }
    

      if (authorized) {
        this.navCtrl.navigateForward('/' + tabs);
      } else {
        const toast = await this.toastController.create({
          message: 'Unauthorized Access: ' + message,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    } catch (error) {
      console.error('Error navigating based on role:', error);
      throw error; // Rethrow error for better error handling
    }
  }

  navigateToAddInventory(): Promise<void> {
    return this.navigateBasedOnRole('add-inventory');
  }

  navigateToUpdateInventory(): Promise<void> {
    return this.navigateBasedOnRole('view');
  }

  navigateToPickupInventory(): Promise<void> {
    return this.navigateBasedOnRole('add-inventory-storeroom');
  }

  navigateToDeliverInventory(): Promise<void> {
    return this.navigateBasedOnRole('analytics');
  }

  navigateToViewStoreRoom(): Promise<void> {
    return this.navigateBasedOnRole('tabs/tab2');
  }

  navigateToStoreInventory(): Promise<void> {
    return this.navigateBasedOnRole('view');
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
