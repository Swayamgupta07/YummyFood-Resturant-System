import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FoodService } from '../../services/food';
import { Food } from '../../models/food';

@Component({
  selector: 'app-edit-food',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-food.html',
  styleUrl: './edit-food.css',
})
export class EditFood implements OnInit {
  foodForm: FormGroup;
  categories: string[] = ['Starters', 'Salads', 'Mains', 'Desserts', 'Drinks'];
  isLoading = false;
  foodId!: number;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.foodForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      imageUrl: ['', [Validators.required]],
      category: ['Mains', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      active: [true],
      dateOfLaunch: ['', [Validators.required]],
      freeDelivery: [false],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.foodId = parseInt(idParam);
      this.loadFoodDetails(this.foodId);
    } else {
      this.errorMessage = 'Invalid food item selected.';
    }
  }

  loadFoodDetails(id: number): void {
    this.foodService.getMenuItemById(id).subscribe({
      next: (food: Food | undefined) => {
        if (food) {

          const launchDate = new Date(food.dateOfLaunch)
            .toISOString()
            .substring(0, 10);

          this.foodForm.patchValue({
            id: food.id,
            name: food.name,
            price: food.price,
            imageUrl: food.imageUrl,
            category: food.category,
            description: food.description,
            active: food.active,
            dateOfLaunch: launchDate,
            freeDelivery: food.freeDelivery,
          });
        } else {
          this.errorMessage = 'Food item not found.';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load food details.';
      },
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

    const updatedFood = {
      ...this.foodForm.value,
      id: this.foodId,
      price: parseFloat(this.foodForm.value.price),
      dateOfLaunch: new Date(this.foodForm.value.dateOfLaunch),
    };

    this.foodService.updateMenuItem(updatedFood).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to update the dish. Please try again.';
      },
    });
  }
}
