import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgFor, NgForOf, NgIf } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';



@Component({
  selector: 'app-details-produit',
  standalone: true,
  imports: [CommonModule,NavbarComponent ,ReactiveFormsModule],
  templateUrl: './details-produit.component.html',
  styleUrl: './details-produit.component.css'
})
export class DetailsProduitComponent implements OnInit {

  stars: number[] = [1, 2, 3, 4, 5]; // Crée un tableau de 5 étoiles
  fullStars: number = 0; // Nombre d'étoiles pleines
  hasHalfStar: boolean = false; // Indique s'il y a une étoile à moitié pleine
  detailsProduct !: any;

  commentForm!: FormGroup;
  selectedRating: number = 3;
  submissionMessage: string | null = null; // Variable to hold the submission message

  constructor(private productService: ProductService, private route: ActivatedRoute,private fb: FormBuilder){
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(5)]]
    });
  }




  ngOnInit(): any {
   
    
    const id: number = this.route.snapshot.params['id'];
    this.productService.getProductDetailsById(+id).
      subscribe((response) => { this.detailsProduct = response ;this.calculateRatingStars(); console.log(response)}, (error) => { console.log('Error fetching products details', error) })
    this.calculateRatingStars();

    this.commentForm = this.fb.group({
      comment: ['']
    });
  }


  calculateRatingStars(): void {
    if (this.detailsProduct) {
      const rating = this.detailsProduct.rating; // Obtient la note du produit
      this.fullStars = Math.floor(rating); // Calcule le nombre d'étoiles pleines
      this.hasHalfStar = (rating % 1) >= 0.5; // Vérifie s'il y a une étoile à moitié pleine
    }}



    getRating(event: any): void {
      const ratingElement = event.target.closest('.rating');
      this.selectedRating = +ratingElement.getAttribute('data-coreui-value');
      console.log('Rating selected:', this.selectedRating);
    }


    submitComment(): void {
      if (this.commentForm.valid) {
        // Handle the comment submission logic (e.g., send to backend)
        // For now, we'll just reset the form and show a message
        this.submissionMessage = 'Your comment has been submitted!';
        this.commentForm.reset(); // Reset the form after submission
      }
    }

 





}





