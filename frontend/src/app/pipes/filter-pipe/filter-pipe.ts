import { Pipe, PipeTransform } from '@angular/core';
import { Food } from '../../models/food/food';

@Pipe({
  name: 'vegFilter',
  standalone: true,
})
export class VegFilterPipe implements PipeTransform {
  transform(foods: Food[], vegOnly: boolean): Food[] {
    if (!vegOnly) return foods;
    return foods.filter((f) => f.isVeg === true);
  }
}
