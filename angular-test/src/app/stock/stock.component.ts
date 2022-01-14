import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
  dataSource = new MatTableDataSource<Product>();//StockTableDataSource | any;

  dataSrc: Product[] = [];

  // tableDataSource = new MatTableDataSource<Product>();
  
  constructor(private productService: ProductService) {
  }

  
  ngOnInit(): void {
   this.productService.getProducts().subscribe(x=> {
    this.dataSrc = x;
     x.forEach( y => {
       console.log(JSON.stringify(y));
     })  
    this.loadData()
   });
   }

  
  public loadData() {
    this.dataSource.data = this.dataSrc;
  }

}
