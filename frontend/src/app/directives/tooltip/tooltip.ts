import { Directive, Input, ElementRef, Renderer2, HostListener, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipTitle: string = '';
  private tooltipEl: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.tooltipTitle) return;
    this.createTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.removeTooltip();
  }

  ngOnDestroy(): void {
    this.removeTooltip();
  }

  private createTooltip(): void {
    this.tooltipEl = this.renderer.createElement('span');
    this.renderer.appendChild(
      this.tooltipEl,
      this.renderer.createText(this.tooltipTitle)
    );

    this.renderer.appendChild(document.body, this.tooltipEl);
    this.renderer.addClass(this.tooltipEl, 'app-custom-tooltip');

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipEl!.getBoundingClientRect();

    const top = hostPos.top - tooltipPos.height - 10 + window.scrollY;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2 + window.scrollX;

    this.renderer.setStyle(this.tooltipEl, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipEl, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipEl, 'opacity', '1');
    this.renderer.setStyle(this.tooltipEl, 'transform', 'translateY(0) scale(1)');
  }

  private removeTooltip(): void {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }
}
