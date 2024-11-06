import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { lignePanier } from '../../models/lignePanier';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { PanierService } from '../panier.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommandeService } from '../commande.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule ,RouterModule,NavbarComponent],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css'
})
export class PanierComponent implements OnInit {

 detailPanier :lignePanier[] = [];
 totalPaymentPrice !: number;

  constructor(private panierService: PanierService , private commandeService : CommandeService, private authService : AuthService, private router : Router ){
    
  }

  ngOnInit(): void {
    this.detailPanier = this.panierService.getPanier();
    this.totalPaymentPrice = this.panierService.updateTotalPrice()
    
  }

  increment(detail:lignePanier) {

    this.panierService.increaseQuantity(detail);
    this.totalPaymentPrice = this.panierService.updateTotalPrice();
  
  }
  
  decrement(detail:lignePanier) {
    this.panierService.decreaseQuantity(detail);
    this.totalPaymentPrice = this.panierService.updateTotalPrice();
    
  }


  delete(detail:lignePanier){

    this.panierService.remove(detail);
    this.totalPaymentPrice = this.panierService.updateTotalPrice();
    

  }

  validerCommande() {
    if (this.authService.isAuthenticated()) {
      const confirmation = confirm("Are you sure you want to confirm your order?");
      if (confirmation) {
        this.commandeService.addCommande(new Date(), this.detailPanier, this.totalPaymentPrice);
        alert("Your order has been confirmed!");
      }
    } else {
      alert("Please log in to confirm your order.");
      this.router.navigate(['/login']);
    }
  }




  


/*
  if (detail.qte > 1) {
    detail.qte--; 
  } else {
    this.remove(detail); 
  }*/
  
  /*
  remove(detail:any) {
    let panier = this.panierService.getPanier();
    panier =panier.filter(item => item.produit.id !== detail.produit.id);
  }





*/
  

}
