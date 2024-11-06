import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { product } from '../../models/product';
import { ProductItemComponent } from '../product-item/product-item.component';
import { lignePanier } from '../../models/lignePanier';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { PanierComponent } from '../panier/panier.component';
import { ProductService } from '../product.service';
import { PanierService } from '../panier.service';


@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [ProductItemComponent, CommonModule, NavbarComponent, PanierComponent],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css'
})


export class ListProductsComponent implements OnInit {

  detailsPanier: Array<lignePanier> = [];

  categoryIschosen: boolean = false;
  categorySelected !: string;
  products !: Array<product>;
  constructor(private productService: ProductService, private panierService: PanierService) { }


  ngOnInit(): any {
    this.productService.getProducts()
      .subscribe((response: any) => {
        this.products = response.products;
      }, (error) => {
        console.error('Error fetching products', error);
      });

    
    this.productService.getProductCategory()
  

  }



  addItem(event: product) {
    const lignePanier: lignePanier = {
      produit: event,
      qte: 1
    };
    this.panierService.ajouterAuPanier(lignePanier);
    console.log('Produit ajouté au panier:', this.panierService.getPanier());
  }


  

  onSearchByKey(event: any) {
    this.productService.getProductBykey(event)
      .subscribe((response: any) => {
        this.products = response.products;
      }, (error) => {
        console.error('Error fetching products', error);
      });

  }


  displayCategoryProducts(event: string) {
    this.categorySelected = event;
    this.categoryIschosen = true;
    this.productService.getProductByCategory(event)
      .subscribe((response: any) => {
        this.products = response.products;
      }, (error) => {
        console.error('Error fetching products Category', error)
      });


  }


  resetCategory(){
    this.categoryIschosen = false;
    this.productService.getProducts()
    .subscribe((response: any) => {
      this.products = response.products;
    }, (error) => {
      console.error('Error fetching products', error);
    });
  }



}

















