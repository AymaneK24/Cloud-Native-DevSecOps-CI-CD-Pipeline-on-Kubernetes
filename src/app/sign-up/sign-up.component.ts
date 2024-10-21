import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule,NavbarComponent ,RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  email: string = '';
  username: string = '';
  password: string = '';

  onSubmit() {
  
    const signUpData = {
      email: this.email,
      username: this.username,
      password: this.password
    };
    
    console.log('Sign Up Data:', signUpData);
  }

}
