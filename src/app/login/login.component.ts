import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../services/firebase.service";
import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  isSignedIn = false;
  constructor(public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.isSignedIn = localStorage.getItem("email") !== null;
  }
  onSignIn(email:string,password:string){
      this.firebaseService.signin(email,password)
      if (this.firebaseService.isLoggedIn){
        this.isSignedIn=true;
        window.location.reload();
    }
  }
  handleLogout(){
    this.firebaseService.logout();
    this.isSignedIn=false;
    window.location.reload();
  }

}
