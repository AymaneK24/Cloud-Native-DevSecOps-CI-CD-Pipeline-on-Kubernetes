import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ListProductsComponent } from './list-products/list-products.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ,ListProductsComponent,HttpClientModule,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'e-commerce';
}
