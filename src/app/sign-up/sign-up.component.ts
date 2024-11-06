import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

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


  constructor(private authService : AuthService){}

  onSubmit() {
    console.log("Created user ")
    this.authService.SignUp(this.email,this.username,this.password);
  }

}
