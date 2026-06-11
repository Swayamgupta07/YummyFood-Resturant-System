import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FoodService } from '../../services/food';

@Component({
  selector: 'app-add-food',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-food.html',
  styleUrl: './add-food.css',
})
export class AddFood {
  foodForm: FormGroup;
  categories: string[] = ['Starters', 'Salads', 'Mains', 'Desserts', 'Drinks'];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private router: Router
  ) {
    this.foodForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      imageUrl: ['', [Validators.required]],
      category: ['Mains', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      active: [true],
      dateOfLaunch: [new Date().toISOString().substring(0, 10), [Validators.required]],
      freeDelivery: [false],
    });
  }
  
  get name() { return this.foodForm.get('name'); }
  get price() { return this.foodForm.get('price'); }
  get imageUrl() { return this.foodForm.get('imageUrl'); }
  get category() { return this.foodForm.get('category'); }
  get description() { return this.foodForm.get('description'); }
  get dateOfLaunch() { return this.foodForm.get('dateOfLaunch'); }

  onSubmit(): void {
    if (this.foodForm.invalid) {
      this.foodForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const newFood = {
      ...this.foodForm.value,
      price: parseFloat(this.foodForm.value.price),
      dateOfLaunch: new Date(this.foodForm.value.dateOfLaunch),
    };

    this.foodService.addMenuItem(newFood).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to add the dish. Please try again.';
      },
    });
  }
}
