import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user.mode';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LandingPage } from '../landing/landing.page';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
 user={} as User;
 selectedRole: string; // Define selectedRole property
 showPassword = false;
 passwordStrength: string = '';

 constructor(
  private toast:ToastController,
  private fauth:AngularFireAuth,
  private load:LoadingController,
  private navController:NavController,
  private firestore: AngularFirestore,

 ){ }

 async signup(user:User) {
  if (!this.user.role) {
    // If role is not selected, handle the error or provide feedback to the user
    console.error('Role is not selected');
    return;
  }else{

     this.selectedRole= this.user.role ; // Assign selected role to user.role
  }

 // user.role = this.selectedRole; // Assign selected role to user.role

  if (this.validation()) {
    const loader = await this.load.create({
      message: "Please wait..."
    });
    await loader.present();
    
    try {
      const userCredential = await this.fauth.createUserWithEmailAndPassword(user.email, user.password);
      const newUser = userCredential.user;

      if (newUser) {
        await newUser.sendEmailVerification();

        // Generate or retrieve user ID (uid) from authentication
        const userId = newUser.uid;

        // Save user data to Firestore using the generated user ID
        await this.firestore.collection('users').doc(userId).set({
          name: user.firstname,
          surname: user.lastname,
          cellphone: user.cellphone,
          email: user.email,
          password: user.password,
          selectedRole:user.role,
          userId:userId // Use user.role here
        });

        this.showToast('Registration successful!');
        this.navController.navigateForward('/login');
      } else {
        this.showToast('User object is null');
      }
    } catch (error) {
      console.error(error);
      let errorMessage: string;

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'User already exists';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User does not exist';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Incorrect email format';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password too short';
          break;
        default:
          errorMessage = 'An error occurred';
          break;
      }

      this.showToast(errorMessage);
    }

    await loader.dismiss();
  }
}

showToast ( message : string ){
  this.toast.create ({
  message: message ,
 duration: 4000
 }). then ( toastData => toastData.present ());
}

isValidEmail:any;
isValidEmailFormat(email: string): boolean {
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
return this.isValidEmail=emailRegex.test(this.user.email);
}

validation(){
  if(!this.user.firstname)
    {
      this.passwordStrength = 'Enter Your Name';
      
      return false;
    }

    if(!this.user.lastname)
      {
        this.passwordStrength = 'Enter Surname';
        
        return false;
      }
      if(!this.user.cellphone)
        {
          this.passwordStrength = 'Enter Your Cellphone number';
         
          return false;
        }
        if((this.user.cellphone.length<10) && (this.user.cellphone.length>10))
          {
            this.passwordStrength = 'Cellphone number Must Contain 10 digits';
           
            return false;
          }
  if(!this.user.email)
  {
   
    this.passwordStrength = 'Enter Your Email Address';
    return false;
  }
  if(!this.user.password)
  {
    this.passwordStrength = 'Enter Your Password';
    
    return false;
  }

  if (this.user.password !== this.user.confpassword) {
    this.passwordStrength = 'Password mismatch!';
   
    return false;
    
  }
  
  
 if (this.user.password.length < 6) {
    this.passwordStrength = 'Password Must Be Atleast 6 characters!';
  
    return false;
  }
  /* if(!this.user.confrimpassword)
  {
    this.showToast("Enter Confirm password")
    return false;
  } */
  return true;
}

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

signupPage() {
  this.navController.navigateForward('/register');
}

ngOnInit() {
   
}

}
