import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn : boolean = false;  
  constructor(private fireauthService : AngularFireAuth) { }

  isAuthenticated() : boolean {
    return this.isLoggedIn ;
  }

/*
  login( email : string , password : string){
    this.fireauthService.signInWithEmailAndPassword(email,password);
  }


  logout(){
    this.fireauthService.signOut()
  }


  SignUp(email : string,password: string){
    this.fireauthService.createUserWithEmailAndPassword(email,password)
  }
  */

  login(){
    this.isLoggedIn =true
  }

  logout(){
    this.isLoggedIn = false
  }



}
