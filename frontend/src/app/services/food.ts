import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Food } from '../models/food';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private apiUrl = 'http://localhost:5000/api/menu';

  private mockFoods: Food[] = [
    {
      id: 1,
      name: 'Creamy Butternut Squash Soup',
      price: 12.99,
      imageUrl: 'https://media.istockphoto.com/id/1276910170/photo/pumpkin-and-carrot-soup-with-cream-in-black-bowl-dark-background-top-view.jpg?s=612x612&w=0&k=20&c=-f7BkK4SQqgfvedY6EIp5SuChcf3C1OyJ6dtC1Fj3JA=',
      category: 'Starters',
      description: 'Slow-roasted butternut squash simmered with coconut cream, nutmeg, toasted pumpkin seeds, and a drizzle of sage oil.',
      active: true,
      dateOfLaunch: new Date(),
      freeDelivery: true
    },
    {
      id: 2,
      name: 'Roasted Maple Sweet Potato Salad',
      price: 14.50,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
      category: 'Salads',
      description: 'Tender maple-glazed sweet potatoes tossed with fresh baby kale, toasted pecans, crisp autumn apples, and a tangy apple cider vinaigrette.',
      active: true,
      dateOfLaunch: new Date(),
      freeDelivery: false
    },
    {
      id: 3,
      name: 'Wild Mushroom & Sage Risotto',
      price: 22.00,
      imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=600',
      category: 'Mains',
      description: 'Creamy Arborio rice slow-cooked with a selection of wild forest mushrooms, fresh sage leaves, shaved parmesan cheese, and black truffle oil.',
      active: true,
      dateOfLaunch: new Date(),
      freeDelivery: true
    },
    {
      id: 4,
      name: 'Smoked Maple Glazed Salmon',
      price: 26.50,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf_gQ82kK6sQef-xeK41O9O58O4VGo2OLlTg&s',
      category: 'Mains',
      description: 'Pan-seared Atlantic salmon fillet glazed with organic Vermont maple syrup, served over roasted garlic asparagus and red quinoa.',
      active: true,
      dateOfLaunch: new Date(),
      freeDelivery: true
    },
    {
      id: 5,
      name: 'Rustic Spiced Apple Tart',
      price: 9.99,
      imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=600',
      category: 'Desserts',
      description: 'Flaky warm pastry filled with spiced Honeycrisp apples and warm cinnamon, topped with salted caramel drizzle and vanilla bean gelato.',
      active: true,
      dateOfLaunch: new Date(),
      freeDelivery: false
    },
    {
      id: 6,
      name: 'Hot Spiced Pumpkin Chai Latte',
      price: 5.50,
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600',
      category: 'Drinks',
      description: 'Rich espresso blended with organic pumpkin puree, autumnal spices, steamed milk of choice, and a dusted cinnamon top.',
      active: true,
      dateOfLaunch: new Date(),
      freeDelivery: false
    }
  ];

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<Food[]> {
    return of(this.mockFoods);
  }

  getMenuItemById(id: number): Observable<Food | undefined> {
    const item = this.mockFoods.find(f => f.id === id);
    return of(item);
  }

  searchMenuItems(query: string): Observable<Food[]> {
    if (!query.trim()) return of(this.mockFoods);
    const filtered = this.mockFoods.filter(f =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.category.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }

  addMenuItem(food: Food): Observable<Food> {
    const nextId = this.mockFoods.length > 0 ? Math.max(...this.mockFoods.map(f => f.id)) + 1 : 1;
    const newFood = { ...food, id: nextId };
    this.mockFoods.push(newFood);
    return of(newFood);
  }

  updateMenuItem(food: Food): Observable<Food> {
    const index = this.mockFoods.findIndex(f => f.id === food.id);
    if (index > -1) {
      this.mockFoods[index] = food;
    }
    return of(food);
  }

  deleteMenuItem(id: number): Observable<boolean> {
    const initialLength = this.mockFoods.length;
    this.mockFoods = this.mockFoods.filter(f => f.id !== id);
    return of(this.mockFoods.length < initialLength);
  }
}
