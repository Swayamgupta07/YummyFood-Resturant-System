import { Component, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart';
import { OrderService } from '../../services/order/order';
import { Address } from '../../services/address/address';
import { AddressInfo } from '../../models/user/user';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Navbar],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  addressForm: FormGroup;
  items = computed(() => this.cartService.items());
  totalPrice = computed(() => this.cartService.totalPrice());
  deliveryCharge = computed(() => this.cartService.deliveryCharge());
  grandTotal = computed(() => this.cartService.grandTotal());
  isLoading = false;
  errorMsg = '';

  savedAddresses: AddressInfo[] = [];
  selectedAddressId: string | null = null;
  isNewAddress = true;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private addressService: Address,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      paymentMethod: ['COD', Validators.required],
      saveToProfile: [true],
    });
  }

  ngOnInit(): void {
    this.loadSavedAddresses();
  }

  loadSavedAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (addrs: AddressInfo[]) => {
        this.savedAddresses = addrs;
        if (addrs.length > 0) {
          this.isNewAddress = false;
          const defaultAddr = addrs.find((a) => a.isDefault);
          this.selectedAddressId = defaultAddr ? defaultAddr._id || null : addrs[0]._id || null;
        }
      },
      error: () => {
        this.isNewAddress = true;
      }
    });
  }

  selectAddress(id: string) {
    this.selectedAddressId = id;
    this.isNewAddress = false;
  }

  useNewAddress() {
    this.isNewAddress = true;
    this.selectedAddressId = null;
    this.addressForm.patchValue({
      street: '',
      city: '',
      state: '',
      zipCode: '',
    });
  }

  get street() { return this.addressForm.get('street'); }
  get city() { return this.addressForm.get('city'); }
  get state() { return this.addressForm.get('state'); }
  get zipCode() { return this.addressForm.get('zipCode'); }

  placeOrder() {
    const paymentMethod = this.addressForm.get('paymentMethod')?.value;

    if (this.isNewAddress) {
      if (this.addressForm.invalid) {
        this.addressForm.markAllAsTouched();
        return;
      }

      this.isLoading = true;
      this.errorMsg = '';

      const { street, city, state, zipCode, saveToProfile } = this.addressForm.value;
      const newAddr: AddressInfo = { street, city, state, zipCode, isDefault: this.savedAddresses.length === 0 };

      if (saveToProfile) {
        this.addressService.addAddress(newAddr).subscribe({
          next: (updatedAddrs: AddressInfo[]) => {
            const saved = updatedAddrs[updatedAddrs.length - 1];
            this.executePlaceOrder(paymentMethod, undefined, saved._id);
          },
          error: (err: any) => {
            this.isLoading = false;
            this.errorMsg = err.error?.message || 'Failed to save address, placing order anyway...';
            this.executePlaceOrder(paymentMethod, newAddr);
          }
        });
      } else {
        this.executePlaceOrder(paymentMethod, newAddr);
      }
    } else {
      if (!this.selectedAddressId) {
        this.errorMsg = 'Please select a delivery address.';
        return;
      }
      this.isLoading = true;
      this.errorMsg = '';
      this.executePlaceOrder(paymentMethod, undefined, this.selectedAddressId);
    }
  }

  private executePlaceOrder(paymentMethod: string, deliveryAddress?: AddressInfo, addressId?: string) {
    const orderData = {
      items: this.items().map((item) => ({
        food: item.food._id,
        quantity: item.quantity,
      })),
      deliveryAddress,
      addressId,
      paymentMethod,
    };

    this.orderService.placeOrder(orderData).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.isLoading = false;
        this.router.navigate(['/order-history']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Failed to place order. Please try again.';
      },
    });
  }
}
