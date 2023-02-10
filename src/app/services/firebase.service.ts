import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Observable} from "rxjs";
import firebase from "firebase/compat";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  userData: Observable<firebase.User>;

  isLoggedIn= false
  constructor(public firebaseAuth : AngularFireAuth) {
    // @ts-ignore
    this.userData=firebaseAuth.authState;
  }
    signin(name:string,password:string){
    this.firebaseAuth.signInWithEmailAndPassword(name,password)
      .then(res=>{
        this.isLoggedIn = true
        localStorage.setItem("email",JSON.stringify(res.user))
        
      })
  }
  logout(){
    this.firebaseAuth.signOut()
    localStorage.removeItem("email")
  }
}
