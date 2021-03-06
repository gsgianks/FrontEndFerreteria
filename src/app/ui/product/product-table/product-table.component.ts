import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/domain/Product';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'ferr-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {

  displayedColumns: string[] = [
    'nombre',
    'precio_Costo',
    'precio_Venta',
    'estado',
    'stock',
    'actionsColumn'
  ];
  dataSource: MatTableDataSource<Product>;
  rowData: Product[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private service: ProductService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.getAll();
    this.dataSource = new MatTableDataSource();
   }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAll(): void {
    this.service.getAll()
    .subscribe(
      response => {
        this.dataSource.data = response.items;
      }
    );
  }

  goEdit(id: number) {
    this.router.navigate(['/product', 'edit', id]);

  }

  showError(error: any): void {
    const msg: string = (error && error.error && error.error.error && error.error.error.message) || error.message;
    alertify.error(msg);
  }

  delete(id: number): void {

    this.confirmationDialogService.confirm('Confirmación', '¿Desea eliminar el registro?')
    .then((confirmed) => {
      if (confirmed) {
        this.service.delete(id)
          .subscribe(response => {
            if (response.codigo === 0) {
              this.getAll();
              alertify.success(response.descripcion);
            } else {
              alertify.error(response.descripcion);
            }
          });
      }
    })
    .catch(() => {});

  }

}
