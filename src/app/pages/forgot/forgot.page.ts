import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.mode';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseError } from 'firebase/app';
import { IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  user={}as User;
  constructor(private toast:ToastController,
    private fauth:AngularFireAuth,
    private load:LoadingController,
    private navController:NavController) { }

    async resetPassword() {
      
      if (this.validation() && this.isValidEmailFormat(this.user.email)) {
        try {
          // Bypass the check and directly send the password reset email
          await this.fauth.sendPasswordResetEmail(this.user.email);
          this.showToast("Password reset email sent. Please check your inbox.");
          this.navController.navigateBack('/login');
        } catch (error) {
          console.error("Error sending password reset email:", error);
          this.showToast("Failed to send password reset email. Please try again.");
        }
      }
    }
    
    showToast(message: string) {
      this.toast.create({
        message: message,
        duration: 4000
      }).then(toastData => toastData.present());
    }
    
    validation() {
      if (!this.user.email) {
        this.showToast("Enter Email address");
        return false;
      }
      return true;
    }
    
    isValidEmailFormat(email: string): boolean {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }
      ngOnInit() {}

  
  
}
