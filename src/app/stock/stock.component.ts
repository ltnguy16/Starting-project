import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
//import { StockDataSource } from './stock-datasource';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { Router } from '@angular/router';
import { StockTableDataSource } from './stock-datasource';
import { fromEvent } from 'rxjs';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})


export class StockComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true }) sort!: MatSort;
  @ViewChild('filter', {static: true}) filter!: ElementRef;




  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'type', 'price', 'quantity'];
  data: ProductService | any;
  dataSource: StockTableDataSource | any;




  ngOnInit(): void {
      this.loadData()
      //this.productService.getAllProducts()
  }

  constructor() {}
  
  public loadData() {
    this.data = new ProductService();
    this.dataSource = new StockTableDataSource(this.data, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if(!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }

}
