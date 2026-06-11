import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../services/food';
import { Food } from '../../models/food';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  foods: Food[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private foodService: FoodService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.foodService.getMenuItems().subscribe({
      next: (items: Food[]) => {
        this.foods = items;
      },
      error: () => {
        this.errorMessage = 'Failed to load menu items.';
      },
    });
  }

  deleteFood(id: number): void {
    if (confirm('Are you sure you want to delete this food item?')) {
      this.foodService.deleteMenuItem(id).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.successMessage = 'Food item deleted successfully.';
            this.loadFoods();
            setTimeout(() => (this.successMessage = ''), 3000);
          } else {
            this.errorMessage = 'Failed to delete food item.';
          }
        },
        error: () => {
          this.errorMessage = 'Error occurred while deleting.';
        },
      });
    }
  }

  editFood(id: number): void {
    this.router.navigate(['/admin/edit-food', id]);
  }
}
