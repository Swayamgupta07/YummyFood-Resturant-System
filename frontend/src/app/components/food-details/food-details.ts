import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../services/food/food';
import { CartService } from '../../services/cart/cart';
import { Auth } from '../../services/auth/auth';
import { Food } from '../../models/food/food';
import { Navbar } from '../navbar/navbar';
import { ImageUrlPipe } from '../../pipes/image-url/image-url';
import { ToastService } from '../../services/toast/toast';

@Component({
  selector: 'app-food-details',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, Navbar, ImageUrlPipe],
  templateUrl: './food-details.html',
  styleUrl: './food-details.css',
})
export class FoodDetails implements OnInit {
  food: Food | null = null;
  isLoggedIn = false;
  currentUser: any = null;

  newRating = 5;
  newComment = '';
  hoverRating = 0;

  errorMsg = '';
  successMsg = '';

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private cartService: CartService,
    private authService: Auth,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();

    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');
      if (id) {
        this.loadFoodDetails(id);
      }
    });
  }

  loadFoodDetails(id: string): void {
    console.log('Fetching food details for ID:', id);
    this.foodService.getFoodById(id).subscribe({
      next: (item: Food) => {
        console.log('Successfully fetched food item:', item);
        this.food = item;
      },
      error: (err: any) => {
        console.error('Error fetching food item:', err);
        this.errorMsg = 'Failed to load food details.';
      }
    });
  }

  addToCart(): void {
    if (this.food && this.food.active) {
      this.cartService.addToCart(this.food);
      this.toastService.show(`${this.food.name} added to cart!`, 'success');
    }
  }

  setRating(rating: number): void {
    this.newRating = rating;
  }

  submitReview(): void {
    if (!this.newComment.trim()) {
      this.errorMsg = 'Please enter a comment.';
      return;
    }

    if (!this.food || !this.food._id) return;

    this.foodService.addReview(this.food._id, this.newRating, this.newComment).subscribe({
      next: (updatedFood: Food) => {
        this.food = updatedFood;
        this.newComment = '';
        this.newRating = 5;
        this.toastService.show('Review submitted successfully!', 'success');
        this.errorMsg = '';
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || 'Failed to submit review.';
      }
    });
  }
}
