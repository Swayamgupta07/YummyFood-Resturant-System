import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressInfo } from '../../models/user/user';

@Injectable({
  providedIn: 'root',
})
export class Address {
  private apiUrl = 'http://localhost:5000/api/users/addresses';

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<AddressInfo[]> {
    return this.http.get(this.apiUrl).pipe(
      map((res: any) => res.data.addresses as AddressInfo[])
    );
  }

  addAddress(address: AddressInfo): Observable<AddressInfo[]> {
    return this.http.post(this.apiUrl, address).pipe(
      map((res: any) => res.data.addresses as AddressInfo[])
    );
  }

  updateAddress(addressId: string, address: AddressInfo): Observable<AddressInfo> {
    return this.http.patch(`${this.apiUrl}/${addressId}`, address).pipe(
      map((res: any) => res.data.address as AddressInfo)
    );
  }

  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${addressId}`);
  }
}
