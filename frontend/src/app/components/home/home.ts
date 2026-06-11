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

  swiggyCategories = [
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200' },
    { name: 'North Indian', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=200' },
    { name: 'Biryani', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=200' },
    { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200' },
    { name: 'South Indian', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=200' },
    { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200' },
    { name: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200' },
    { name: 'Noodles', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=200' },
    { name: 'Rolls', image: 'https://images.unsplash.com/photo-1626700051175-6518c4793fde?auto=format&fit=crop&q=80&w=200' },
    { name: 'Ice Cream', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=200' },
    { name: 'Coffee', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=200' },
    { name: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3bb64e0be5e?auto=format&fit=crop&q=80&w=200' }
  ];

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
