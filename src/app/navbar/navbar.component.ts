import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { lignePanier } from '../../models/lignePanier';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { routes } from '../app.routes';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isSearchActive: boolean = false;
  @Output() currentPanier : lignePanier[]=[];
  @Output() displayedPanier = new EventEmitter<boolean> ;
  categories: string[] = [];
  searchKey !: string;
  @Output() searchedText = new EventEmitter<string>();
  @Output() selectedCategory = new EventEmitter<string>();
  isAuthenticated: boolean = false;
  username: string | null = null;
  @Output() resetProducts = new EventEmitter<void>();

  constructor (private productService : ProductService , private authService : AuthService , private router : Router){}


  ngOnInit(): any {
    
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
      if (isLoggedIn) {
          this.authService.getUsername().then((name) => {
              this.username = name; 
          });
      } else {
          this.username = null; 
      }
  });


    this.productService.getProductCategory()
    .subscribe((response :any) =>{
      this.categories = response;
      }, (error: any) => {
        console.error('Error fetching products', error);  
      });

    
      
    }

    showPanier(){
      this.displayedPanier.emit(true);
    }
  
  
    toggleSearch() {
      this.isSearchActive = !this.isSearchActive; 
    }

    onSearchByKey(){
      console.log(this.searchKey)
      this.searchedText.emit(this.searchKey)

    }


    onCategoryClick(category : string){
      this.selectedCategory.emit(category);

    }



    signIn() {
      this.router.navigate(['/auth']);

    }
    


    signOut(){
     this.authService.logout();

    }

    
 
  
    onHomeClick() {
      this.resetProducts.emit(); // Emit an event when "Home" is clicked
    }

  

}
