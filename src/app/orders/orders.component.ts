import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { commande } from '../../models/commande';
import { CommandeService } from '../commande.service';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  userOrders : commande[] = [];

  constructor(private commandeService : CommandeService , private authService : AuthService){}

   ngOnInit(){
    this.authService.getUserId().then(userId => {
      if (userId) {
        console.log(userId)
        this.commandeService.getUserOrders(userId).subscribe(orders => {
          this.userOrders = orders;
          
          console.log(orders)
        });
      }
    });
    
    
  }
}
