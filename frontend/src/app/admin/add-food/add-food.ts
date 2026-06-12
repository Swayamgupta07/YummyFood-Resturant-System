import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FoodService } from '../../services/food/food';
import { Navbar } from '../../components/navbar/navbar';
import { FOOD_CATEGORIES } from '../../constants/constants';

@Component({
  selector: 'app-add-food',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './add-food.html',
  styleUrl: './add-food.css',
})
export class AddFood {
  foodForm: FormGroup;
  isLoading = false;
  errorMsg = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  categories = FOOD_CATEGORIES;

  constructor(private fb: FormBuilder, private foodService: FoodService, private router: Router) {
    this.foodForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      isVeg: [false],
      freeDelivery: [false],
      imageUrl: [''],
      active: [true],
    });
  }

  get name() { return this.foodForm.get('name'); }
  get price() { return this.foodForm.get('price'); }
  get description() { return this.foodForm.get('description'); }
  get category() { return this.foodForm.get('category'); }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => { this.previewUrl = e.target?.result as string; };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  clearSelectedFile() {
    this.selectedFile = null;
    this.previewUrl = null;
    const fileInput = document.getElementById('af-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit() {
    if (this.foodForm.invalid) {
      this.foodForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';

    const formData = new FormData();
    const val = this.foodForm.value;
    formData.append('name', val.name);
    formData.append('price', val.price);
    formData.append('description', val.description);
    formData.append('category', val.category);
    formData.append('isVeg', val.isVeg);
    formData.append('freeDelivery', val.freeDelivery);
    formData.append('active', val.active);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (val.imageUrl) {
      formData.append('imageUrl', val.imageUrl);
    }

    this.foodService.addFood(formData).subscribe({
      next: () => { this.isLoading = false; this.router.navigate(['/admin']); },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Failed to add food item.';
      },
    });
  }
}
