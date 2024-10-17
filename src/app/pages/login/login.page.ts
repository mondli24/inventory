import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { User } from 'src/app/models/user.mode';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { collection, getDocs, getFirestore, query, where } from '@firebase/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {} as User;
  loginForm:FormGroup;
  selectedRole:any;
  email:string='';
  password:string='';
  constructor(private toast: ToastController,  
    private fauth: AngularFireAuth,
    private load: LoadingController,
    private navController: NavController,
    private  authService:AuthenticationService
  ) 
  { }
  showPassword = false;

  async loginWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle();
      // Handle successful login (e.g., navigate to another page)
      this.navController.navigateForward('/picker');
      console.log('Logged in user:', user);
    } catch (err) {
      console.error('Login error:', err);
    }
  }
  
  async login(user: User) {
    try {
      if (this.validation()) {
        if(this.checkEmail(this.user.email)) {
          const checkpass= await this.checkPassword(this.user.email, this.user.password);
          if(checkpass){
            const currentuser= await this.fauth.currentUser;
            if(currentuser && currentuser.emailVerified){
              console.log("User verified");
              let loader = this.load.create({
                message: "Signning In...",
                 spinner: 'crescent',
                duration: 4000,
                showBackdrop: true,

              });
              (await (loader)).present();
              await this.retrieveData();

              if(this.selectedRole === "manager" ){
                await this.fauth.signInWithEmailAndPassword(this.user.email, this.user.password ).then(async () => {
                  (await loader).dismiss();
                  this.navController.navigateForward('/manager');
  
                }).catch((e: FirebaseError) => {
                  this.handleFirebaseError(e);
                });
              }
              if(this.selectedRole === "picker" ){
                await this.fauth.signInWithEmailAndPassword(this.user.email, this.user.password ).then(async () => {
                  (await loader).dismiss();
                  this.navController.navigateForward('/picker');
  
                }).catch((e: FirebaseError) => {
                  this.handleFirebaseError(e);
                });
              }
             
            }else{
              this.showToast("Verify Your Email!");
            }


          }else{
            this.showToast("Incorrect Password!.")
          }
        }else{
          this.showToast("Invalid email format");
        }
      }


    } catch (e) {
      console.log(e);
      this.showToast('Invalid Credentials');
    }
  }

  async checkPasswordMatches(email: string, password: string): Promise<boolean> {
    try {
      const credential = await this.fauth.signInWithEmailAndPassword(email, password);
      return credential.user !== null;
    } catch (error) {
      return false;
    }
  }

  checkEmail(email1: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email1);
  }
  async checkPassword(email: string, password: string): Promise<boolean> {
    try {
      // Sign in with the provided email and password to verify the password
      const credential = await this.fauth.signInWithEmailAndPassword(email, password);
      return credential.user !== null;
    } catch (error) {
      return false; // Password does not match
    }
  }
  async retrieveData() {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', this.user.email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        this.selectedRole = data['selectedRole'];

      } else {
        console.log('No data found for the user');
      }
    } catch (error) {
      console.error('Error retrieving data from Firestore: ', error);
    }
  }

  showToast(message: string) {
    this.toast.create({
      message: message,
      duration: 4000
    }).then(toastData => toastData.present());
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  


  validation() {
    if (!this.user.email) {
      this.passwordStrength = 'Enter Your Email';
     
      return false;
    }
    if (!this.user.password) {
      this.passwordStrength = 'Enter Your Password';
    
      return false;
    }
    if (this.user.password.length < 6) {
      this.passwordStrength = 'Password Must Be Atleast 6 characters!';
      
      return false;
    }
    return true;
  }
   passwordStrength: string = '';
  handleFirebaseError(e: FirebaseError) {
    switch (e.code) {
      case 'auth/wrong-password':
        this.showToast('Invalid password. Try again.');
        this.passwordStrength = 'Invalid password. Try again.';
        break;
      case 'auth/email-already-in-use':
        this.passwordStrength = 'User already exists. Try again.';
        this.showToast('User already exists. Try again.');
        break;
      case 'auth/user-not-found':
        this.passwordStrength = 'User does not exist. Try again.';
        this.showToast('User does not exist. Try again.');
        break;
      case 'auth/invalid-email':
        this.passwordStrength = 'Incorrect email format. Try again.';
        this.showToast('Incorrect email format. Try again.');
        break;
      case 'auth/weak-password':
        this.passwordStrength = 'Password too short. Try again.';
        this.showToast('Password too short. Try again.');
        break;
      default:
        this.passwordStrength = 'An error occurred. Please try again.';
        this.showToast('An error occurred. Please try again.');
        break;
    }
  }


  ngOnInit(): void {

    console.log('Hello sign in Page');
  }

  
}
