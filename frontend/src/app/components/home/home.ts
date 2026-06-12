import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../services/food/food';
import { CartService } from '../../services/cart/cart';
import { Food } from '../../models/food/food';
import { Navbar } from '../navbar/navbar';
import { SYSTEM_IMAGES } from '../../constants/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  menuItems: Food[] = [];
  filteredItems: Food[] = [];
  categories: string[] = ['All'];
  selectedCategory: string = 'All';
  searchQuery: string = '';

  swiggyCategories: any[] = [];
  systemImages = SYSTEM_IMAGES;

  constructor(
    private foodService: FoodService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.foodService.getFoods().subscribe({
      next: (items: Food[]) => {
        this.menuItems = items;
        this.filteredItems = items;
        const dbCategories = Array.from(new Set(items.map(f => f.category)));
        this.categories = ['All', ...dbCategories];
      },
    });

    this.foodService.getCategories().subscribe({
      next: (cats: any[]) => {
        this.swiggyCategories = cats;
      }
    });
  }

  scrollCategories(offset: number): void {
    const container = document.getElementById('categories-scroll');
    if (container) {
      container.scrollBy({
        left: offset,
        behavior: 'smooth'
      });
    }
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let items = this.menuItems;

    if (this.selectedCategory !== 'All') {
      items = items.filter((item) => item.category.toLowerCase() === this.selectedCategory.toLowerCase());
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    this.filteredItems = items;
  }

  addToCart(food: Food): void {
    this.cartService.addToCart(food);
  }
}
