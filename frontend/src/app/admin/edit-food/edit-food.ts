import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FoodService } from '../../services/food/food';
import { Food } from '../../models/food/food';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-edit-food',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './edit-food.html',
  styleUrl: './edit-food.css',
})
export class EditFood implements OnInit {
  foodForm: FormGroup;
  isLoading = false;
  isLoadingData = true;
  errorMsg = '';
  foodId = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  categories = ['Pizza', 'North Indian', 'Biryani', 'Burger', 'South Indian', 'Desserts', 'Cake', 'Noodles', 'Rolls', 'Ice Cream', 'Coffee', 'Pasta'];

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private router: Router,
    private route: ActivatedRoute
  ) {
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

  ngOnInit(): void {
    this.foodId = this.route.snapshot.paramMap.get('id') || '';
    if (this.foodId) {
      this.foodService.getFoodById(this.foodId).subscribe({
        next: (food: Food) => {
          this.foodForm.patchValue(food);
          this.previewUrl = food.imageUrl;
          this.isLoadingData = false;
        },
        error: () => { this.isLoadingData = false; this.errorMsg = 'Failed to load food data.'; },
      });
    }
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
      this.foodForm.patchValue({ imageUrl: '' });
    }
  }

  clearSelectedFile() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.foodForm.patchValue({ imageUrl: '' });
    const fileInput = document.getElementById('ef-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit() {
    if (this.foodForm.invalid) { this.foodForm.markAllAsTouched(); return; }
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
    this.foodService.updateFood(this.foodId, formData).subscribe({
      next: () => { this.isLoading = false; this.router.navigate(['/admin']); },
      error: (err: any) => { this.isLoading = false; this.errorMsg = err.error?.message || 'Failed to update.'; },
    });
  }
}
