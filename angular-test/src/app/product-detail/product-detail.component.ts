import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ProductService } from '../product.service';
import { Product } from '../product';



@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product | undefined;
  form: any;
  

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getProduct();
    this.form = this.fb.group({
      type: [this.product?.type, Validators.required],
      price: [this.product?.price, Validators.required],
      quantity: [this.product?.quantity, Validators.required],
    });
  }

  getProduct(): void {
    const name = String(this.route.snapshot.paramMap.get('name'));
    this.productService.getProduct(name)
      .subscribe(product => this.product = product);
  }
  
  goBack(): void {
    this.location.back();
  }

  async onSubmit(): Promise<void> {
    const type = this.form.get('type')?.value;
    const price = this.form.get('price')?.value;
    const quantity = this.form.get('quantity')?.value;
  }
}
