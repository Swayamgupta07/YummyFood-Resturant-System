import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../services/food';
import { CartService } from '../../services/cart';
import { Food } from '../../models/food';

@Component({
  selector: 'app-food-list',
  imports: [RouterLink, CommonModule],
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
    this.foodService.getMenuItems().subscribe({
      next: (items: Food[]) => {
        let results = items.filter((f) => f.category.toLowerCase() === category.toLowerCase());
        if (results.length === 0) {
          results = this.generateDynamicCategoryFoods(category);
        }

        this.foods = results;
        this.applyFilters();
      }
    });
  }

  generateDynamicCategoryFoods(category: string): Food[] {
    const mockImageMap: { [key: string]: string[] } = {
      'Pizza': [
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600'
      ],
      'North Indian': [
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600'
      ],
      'Biryani': [
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=600'
      ],
      'Burger': [
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=600'
      ],
      'South Indian': [
        'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600'
      ],
      'Desserts': [
        'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=600'
      ],
      'Cake': [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600'
      ],
      'Noodles': [
        'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=600'
      ],
      'Rolls': [
        'https://images.unsplash.com/photo-1626700051175-6518c4793fde?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?auto=format&fit=crop&q=80&w=600'
      ],
      'Ice Cream': [
        'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600'
      ],
      'Coffee': [
        'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&q=80&w=600'
      ],
      'Pasta': [
        'https://images.unsplash.com/photo-1621996346565-e3bb64e0be5e?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600'
      ]
    };

    const imgs = mockImageMap[category] || [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600'
    ];

    return [
      {
        id: 101,
        name: `Classic Premium ${category}`,
        price: 199.00,
        imageUrl: imgs[0],
        category: category,
        description: `Indulge in our classic handcrafted ${category} prepared with signature home recipe and authentic spices.`,
        active: true,
        dateOfLaunch: new Date(),
        freeDelivery: true
      },
      {
        id: 102,
        name: `Double Delight ${category}`,
        price: 249.00,
        imageUrl: imgs[1] || imgs[0],
        category: category,
        description: `A double serving of goodness! Loaded with extra toppings, premium cheese, and a rich taste profile.`,
        active: true,
        dateOfLaunch: new Date(),
        freeDelivery: false
      },
      {
        id: 103,
        name: `Organic Diet ${category}`,
        price: 179.00,
        imageUrl: imgs[2] || imgs[0],
        category: category,
        description: `Lighter, healthier, yet incredibly flavorful. Cooked with olive oil and fresh seasonal greens.`,
        active: true,
        dateOfLaunch: new Date(),
        freeDelivery: true
      }
    ];
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
      results = results.filter((item) => item.price < 210);
    }

    if (this.highRatedOnly) {
      results = results.filter((item) => item.freeDelivery);
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
