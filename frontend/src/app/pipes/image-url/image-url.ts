import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';
    return value.startsWith('/uploads') ? `${environment.imageUrl}${value}` : value;
  }
}
