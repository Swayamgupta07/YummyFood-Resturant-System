import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../services/food/food';
import { CartService } from '../../services/cart/cart';
import { Food } from '../../models/food/food';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [RouterLink, CommonModule, Navbar],
  templateUrl: './food-list.html',
  styleUrl: './food-list.css',
})
export class FoodList implements OnInit {
  categoryName: string = '';
  categoryDescription: string = '';
  foods: Food[] = [];
  filteredFoods: Food[] = [];

  activeSort: string = 'Relevance';
  vegOnly: boolean = false;
  highRatedOnly: boolean = false;
  freeDeliveryOnly: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: import('@angular/router').ParamMap) => {
      const name = params.get('name');
      if (name) {
        this.categoryName = name;
        this.setCategoryDescription(name);
        this.loadFoods(name);
      }
    });
  }

  setCategoryDescription(name: string): void {
    const descriptions: { [key: string]: string } = {
      'Pizza': 'Hot, cheesy, and loaded with your favorite gourmet toppings.',
      'North Indian': 'Rich curries, buttery naans, and authentic traditional spices.',
      'Biryani': 'Aromatic long-grain basmati rice cooked to perfection with rich spices.',
      'Burger': 'Juicy patties layered with fresh greens, cheese, and gourmet sauces.',
      'South Indian': 'Crispy dosas, fluffy idlis, and hot sambar made fresh.',
      'Desserts': 'Indulgent sweets, pastries, and treats to satisfy your sweet tooth.',
      'Cake': 'Freshly baked premium sponges with luscious creams and toppings.',
      'Noodles': 'Stir-fried noodles loaded with veggies and premium sauces.',
      'Rolls': 'Soft wraps loaded with roasted meats, paneer, and tasty chutneys.',
      'Ice Cream': 'Flavourful ice creams that will make you smile a bit wider.',
      'Coffee': 'Freshly brewed premium beans to elevate your sensory experience.',
      'Pasta': 'Classic Italian pasta tossed in signature creamy and tangy sauces.'
    };
    this.categoryDescription = descriptions[name] || 'Delicious dishes handpicked for your gourmet experience.';
  }

  loadFoods(category: string): void {
    this.foodService.getFoods(category).subscribe({
      next: (items: Food[]) => {
        this.foods = items;
        this.applyFilters();
      }
    });
  }

  toggleVeg(): void {
    this.vegOnly = !this.vegOnly;
    this.applyFilters();
  }

  toggleHighRated(): void {
    this.highRatedOnly = !this.highRatedOnly;
    this.applyFilters();
  }

  toggleFreeDelivery(): void {
    this.freeDeliveryOnly = !this.freeDeliveryOnly;
    this.applyFilters();
  }

  changeSort(sortOption: string): void {
    this.activeSort = sortOption;
    this.applyFilters();
  }

  applyFilters(): void {
    let results = [...this.foods];

    if (this.vegOnly) {
      // client filter as fallback or helper
      results = results.filter((item) => item.isVeg === true);
    }

    if (this.highRatedOnly) {
      results = results.filter((item) => item.rating ? item.rating >= 4.5 : false);
    }
    if (this.freeDeliveryOnly) {
      results = results.filter((item) => item.freeDelivery);
    }

    if (this.activeSort === 'Price: Low to High') {
      results.sort((a, b) => a.price - b.price);
    } else if (this.activeSort === 'Price: High to Low') {
      results.sort((a, b) => b.price - a.price);
    }

    this.filteredFoods = results;
  }

  addToCart(food: Food): void {
    this.cartService.addToCart(food);
  }
}
