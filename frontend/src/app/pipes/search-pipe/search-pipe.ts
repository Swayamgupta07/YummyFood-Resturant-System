import { Pipe, PipeTransform } from '@angular/core';
import { Food } from '../../models/food/food';

@Pipe({
  name: 'searchFood',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(foods: Food[], query: string): Food[] {
    if (!query || !query.trim()) return foods;
    const lq = query.toLowerCase();
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(lq) ||
        f.description.toLowerCase().includes(lq) ||
        f.category.toLowerCase().includes(lq)
    );
  }
}
