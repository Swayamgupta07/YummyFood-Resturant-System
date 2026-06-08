import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../services/food';
import { CartService } from '../../services/cart';
import { Food } from '../../models/food';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  menuItems: Food[] = [];
  filteredItems: Food[] = [];
  categories: string[] = ['All', 'Starters', 'Salads', 'Mains', 'Desserts', 'Drinks'];
  selectedCategory: string = 'All';
  searchQuery: string = '';

  constructor(
    private foodService: FoodService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.foodService.getMenuItems().subscribe({
      next: (items: Food[]) => {
        this.menuItems = items;
        this.filteredItems = items;
      },
    });
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
      items = items.filter((item) => item.category === this.selectedCategory);
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
