import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration = 3000): void {
    const id = this.nextId++;
    const newToast: Toast = { id, message, type };
    this.toasts.update((current) => [...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
