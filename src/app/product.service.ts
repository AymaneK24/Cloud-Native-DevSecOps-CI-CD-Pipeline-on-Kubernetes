import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { 
  }

  getProducts(){
    return this.http.get('https://dummyjson.com/products')
  }

  getProductCategory(){
    return this.http.get('https://dummyjson.com/products/category-list')

  }


  getProductByCategory(category : string){
    console.log("selected category",category)
    return this.http.get(`https://dummyjson.com/products/category/${category}`)
  }

  getProductBykey(text : string){
    
    return this.http.get(`https://dummyjson.com/products/search?q=${text}`)
  }


  getProductDetailsById(id : number){
    return this.http.get(`https://dummyjson.com/products/${id}`)
  }

  
}
