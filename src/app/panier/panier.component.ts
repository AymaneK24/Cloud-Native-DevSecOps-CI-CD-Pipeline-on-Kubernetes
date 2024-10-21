import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { lignePanier } from '../../models/lignePanier';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanierService } from '../panier.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { product } from '../../models/product';

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

  constructor(private panierService: PanierService){
    
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
