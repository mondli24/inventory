import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor( public ngFireAuth:AngularFireAuth, private router: Router ) { }
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await this.ngFireAuth.signInWithPopup(provider);
    return credential.user;
  }


}



