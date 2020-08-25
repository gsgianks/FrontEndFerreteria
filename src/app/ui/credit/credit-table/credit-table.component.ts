import { Component, OnInit, ViewChild } from '@angular/core';
import * as alertify from 'alertifyjs';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Credit } from 'src/app/domain/Credit';
import { BaseService } from 'src/app/services/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mot-credit-table',
  templateUrl: './credit-table.component.html',
  styleUrls: ['./credit-table.component.scss']
})
export class CreditTableComponent implements OnInit {

  displayedColumns: string[] = [
    'id_Usuario',
    'nombre_Producto',
    'precio_Venta_Producto',
    'cantidad',
    'fecha_Creacion',
    'estado',
    'actionsColumn'
  ];
  dataSource: MatTableDataSource<Credit>;
  rowData: Credit[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private service: BaseService<Credit>,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.service.Api = 'Credito';
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
    this.router.navigate(['/credit', 'edit', id]);

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
