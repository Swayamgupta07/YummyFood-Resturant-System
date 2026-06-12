import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Food } from '../../models/food/food';

@Injectable({ providedIn: 'root' })
export class FoodService {
  private apiUrl = 'http://localhost:5000/api/foods';

  constructor(private http: HttpClient) {}

  getFoods(category?: string, search?: string): Observable<Food[]> {
    let params = new HttpParams();
    if (category && category !== 'All') params = params.set('category', category);
    if (search) params = params.set('search', search);
    return this.http.get(this.apiUrl, { params }).pipe(
      map((res: any) => res.data.foods as Food[])
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get('http://localhost:5000/api/categories').pipe(
      map((res: any) => res.data.categories)
    );
  }

  getFoodById(id: string): Observable<Food> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      map((res: any) => res.data.food as Food)
    );
  }

  addFood(formData: FormData): Observable<Food> {
    return this.http.post(this.apiUrl, formData).pipe(
      map((res: any) => res.data.food as Food)
    );
  }

  updateFood(id: string, formData: FormData): Observable<Food> {
    return this.http.patch(`${this.apiUrl}/${id}`, formData).pipe(
      map((res: any) => res.data.food as Food)
    );
  }

  deleteFood(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addReview(foodId: string, rating: number, comment: string): Observable<Food> {
    return this.http.post(`${this.apiUrl}/${foodId}/reviews`, { rating, comment }).pipe(
      map((res: any) => res.data.food as Food)
    );
  }
}
