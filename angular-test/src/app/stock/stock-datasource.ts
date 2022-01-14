import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';

import { ProductService } from '../product.service';
import { Product } from '../product';

export class StockTableDataSource extends DataSource<Product> {
    filterChange = new BehaviorSubject('');

    get filter(): string {
        return this.filterChange.value;
    }

    set filter(filter: string) {
        this.filterChange.next(filter);
    }

    filterData: Product[] = [];
    renderdData: Product[] = [];
 
    constructor(
        public productService: ProductService,
        public paginator: MatPaginator,
        public sort: MatSort,
        ) {
      super();
      this.filterChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    
    connect(): Observable<Product[]> {
      const data = [
          this.productService.dataChange,
          this.sort.sortChange,
          this.filterChange,
          this.paginator.page,
      ]

      this.productService.getAllProducts();

      if (this.paginator && this.sort) {
        // Combine everything that affects the rendered data into one update
        // stream for the data-table to consume.
        return merge(...data).pipe(map(() => {
            this.filterData = this.productService.data.slice().filter((product: Product) => {
                const searchStr = (product.name + product.type + product.price + product.quantity).toLowerCase();
                return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            });

            const sortedData = this.getSortedData(this.filterData.slice());

            const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
            this.renderdData = sortedData.splice(startIndex, this.paginator.pageSize);
            return this.renderdData;
          }));
      } else {
        throw Error('Please set the paginator and sort on the data source before connecting.');
      }
    }
  
    /**
     *  Called when the table is being destroyed. Use this function, to clean up
     * any open connections or free any held resources that were set up during connect.
     */
    disconnect(): void {}
  
    /**
     * Paginate the data (client-side). If you're using server-side pagination,
     * this would be replaced by requesting the appropriate data from the server.
     */

    /**
     * Sort the data (client-side). If you're using server-side sorting,
     * this would be replaced by requesting the appropriate data from the server.
     */
    private getSortedData(data: Product[]): Product[] {
      if (!this.sort || !this.sort.active || this.sort.direction === '') {
        return data;
      }
  
      return data.sort((a, b) => {
        const isAsc = this.sort?.direction === 'asc';
        switch (this.sort?.active) {
          case 'name': return compare(a.name, b.name, isAsc);
          case 'type': return compare(+a.type, +b.type, isAsc);
          case 'price': return compare(a.price, b.price, isAsc);
          case 'quantity': return compare(a.quantity, b.quantity, isAsc);
          default: return 0;
        }
      });
    }
  }
  
  /** Simple sort comparator for example ID/Name columns (for client-side sorting). */
  function compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }