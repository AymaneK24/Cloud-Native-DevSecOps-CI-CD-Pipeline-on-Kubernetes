import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { error } from 'console';
import { response } from 'express';
import {getAuth, sendEmailVerification, updateCurrentUser, updateProfile} from "firebase/auth"
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {
   getToken !: string
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); 
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private afAuth: AngularFireAuth,private router : Router) {

    if (typeof window !== 'undefined' && window.sessionStorage){
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      this.isLoggedInSubject = new BehaviorSubject<boolean>(isLoggedIn); 
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
    }
   
    
  }

 


  private saveLoginState(isLoggedIn: boolean): void {
    sessionStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    this.isLoggedInSubject.next(isLoggedIn); // Met à jour l'état
  }




  SignUp(email: string, username: string, password: string): void {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        user?.sendEmailVerification()
          .then(() => alert("Verification email sent. Please check your email."));
      })
      .catch((error) => {
        console.error("Error signing up:", error);
      });
  }

  login(email: string, password: string): void {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        
        this.saveLoginState(true)
        
      })
      .catch((error) => {
        console.log("An error occurred during login:", error);
      });
  }

  logout(): void {
    this.afAuth.signOut()
      .then(() => {
      
        this.saveLoginState(false);
      })
      

      .catch((error) => {
        console.log("An error occurred during logout:", error);
      });
  }

  async getUsername(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    console.log(user ? user.displayName : null);
    return user ? user.displayName : null; 
}
  
}

