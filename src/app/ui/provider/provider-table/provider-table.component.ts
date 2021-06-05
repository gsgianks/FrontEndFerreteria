import { Component, OnInit, Provider, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import * as alertify from 'alertifyjs';
import { Constants } from 'src/app/common/Constants';

@Component({
  selector: 'mot-provider-table',
  templateUrl: './provider-table.component.html',
  styleUrls: ['./provider-table.component.scss']
})
export class ProviderTableComponent implements OnInit {

  displayedColumns: string[] = [
    'nombre_Proveedor',
    'telefono',
    'correo_Electronico',
    'actionsColumn'
  ];
  dataSource: MatTableDataSource<Provider>;
  rowData: Provider[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private service: BaseService<Provider>,
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
    this.service.getAll(Constants.Provider)
    .subscribe(
      response => {
        this.dataSource.data = response.items;
      }
    );
  }

  goEdit(id: number) {
    this.router.navigate(['/provider', 'edit', id]);

  }

  showError(error: any): void {
    const msg: string = (error && error.error && error.error.error && error.error.error.message) || error.message;
    alertify.error(msg);
  }

  delete(id: number): void {

    this.confirmationDialogService.confirm('Confirmación', '¿Desea eliminar el registro?')
    .then((confirmed) => {
      if (confirmed) {
        this.service.delete(Constants.Provider, id)
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