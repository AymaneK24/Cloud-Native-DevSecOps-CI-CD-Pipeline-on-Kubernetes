import { Inject, Injectable } from '@angular/core';
import { lignePanier } from '../models/lignePanier';
import { product } from '../models/product';
import { Firestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class PanierService {

  private panier: Array<lignePanier> = [];
  private totalprice :number =0  ;


  constructor() {
      if (typeof window !== 'undefined' && window.sessionStorage){
      const savedPanier = sessionStorage.getItem('panier');
      if (savedPanier) {
        this.panier = JSON.parse(savedPanier);
      }
    }
    
  }


  savePanier(){
    sessionStorage.setItem("panier",JSON.stringify(this.panier))
  }


  ajouterAuPanier(produit: lignePanier) {
    const produitExistant = this.panier.find(item => item.produit.id === produit.produit.id);

    if (produitExistant) {
      produitExistant.qte++;
    } else {
      this.panier.push(produit);
    }

    this.savePanier()
  }


  getPanier(): Array<lignePanier> {
    return this.panier;
  }

  updateTotalPrice(){
    this.totalprice = 0
    this.panier.forEach(item => this.totalprice += item.produit.price*item.qte)
    console.log(this.totalprice)
    return this.totalprice
  }


  viderPanier() {
    this.panier = [];
  }


  increaseQuantity(detail :  lignePanier){
    detail.qte++;
    this.savePanier()
    
  }

  remove(detail: lignePanier){
    const produitConcerned = this.panier.find(item => item.produit.id === detail.produit.id);
    if(produitConcerned){
    const index = this.panier.indexOf(produitConcerned);
      if (index > -1) {
        this.panier.splice(index, 1); 
      }
    }
    this.savePanier()
    console.log(this.panier)
  }


  decreaseQuantity(detail : lignePanier){

    detail.qte>1 ?  detail.qte-- : this.remove(detail)
    this.savePanier()
    }

  
  
  
  

  



}



