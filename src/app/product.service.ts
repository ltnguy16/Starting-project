import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from './product';
import { PRODUCTS } from './mock-products';
import { HttpErrorResponse } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  dataChange: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor() { }

  get data(): Product[] {
    return this.dataChange.value;
  }

  getAllProducts(): void{
    this.getProducts().subscribe(
      data => { this.dataChange.next(data);
      },
      //(error: HttpErrorResponse) => { console.log (error.name + ' ' + error.message); },
    );
  }
  getProducts(): Observable<Product[]> {
    const products = of(PRODUCTS);
    return products;
  }

  getProduct(name: string): Observable<Product> {
    const product = PRODUCTS.find(p => p.name === name)!;
    return of(product);
  }

}
