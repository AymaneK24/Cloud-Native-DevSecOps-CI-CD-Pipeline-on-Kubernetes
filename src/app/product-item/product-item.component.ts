import { Component, EventEmitter, Input, Output } from '@angular/core';
import { product } from '../../models/product';
import { NgIf, NgStyle } from '@angular/common';
import { ProductService } from '../product.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [NgStyle,NgIf,RouterModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
  @Input() produit !: product;
  @Output() selectedProduct = new EventEmitter<product>();
  @Output() selectedDetailsProduct: EventEmitter<any> = new EventEmitter();

  constructor(private productService : ProductService, private router: Router){}

  addToPanier(){
    this.selectedProduct.emit(this.produit);
  }

  getState(){
    return this.produit.stock > 0 ? "En stock" : "En rupture de stock";

  }


  getColor(){
    return this.produit.stock > 0 ? "green" : "red";

  }


  
}
