import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule,NavbarComponent,RouterModule,CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  constructor(private authService :AuthService , private router : Router){}



  onSubmit() {
  this.authService.login(this.email,this.password);
}

  /*
 login(f : NgForm){

  console.log(f.value["email"] + ':' + f.value['password'])
  this.authService.login(f.value['email'],f.value['password']).subscribe{
    (res) => 
  }

  

 }*/
  
    SignIn(){
      this.authService.login(this.email,this.password);
      this.router.navigate(['/']);
    }

   
}