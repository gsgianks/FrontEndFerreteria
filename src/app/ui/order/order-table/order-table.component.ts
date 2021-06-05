import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Constants } from 'src/app/common/Constants';
import { Order } from 'src/app/domain/Order';
import { BaseService } from 'src/app/services/base.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'mot-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss']
})
export class OrderTableComponent implements OnInit {

  displayedColumns: string[] = [
    'nombre_Usuario',
    'fecha_Creacion',
    'estado',
    'direccion',
    'fecha_Entrega',
    'actionsColumn'
  ];
  dataSource: MatTableDataSource<Order>;
  rowData: Order[] = [];
  @Input() estado: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private service: BaseService<Order>,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.dataSource = new MatTableDataSource();
   }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAll();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAll(): void {
    this.service.getAll(Constants.Order).subscribe(r => {
        if (r.codigo === 0) {
          this.dataSource.data = r.items;
        } else {
          alertify.error(r.descripcion);
        }
      }
    );
  }

  showError(error: any): void {
    const msg: string = (error && error.error && error.error.error && error.error.error.message) || error.message;
    alertify.error(msg);
  }

  delete(id: number): void {

    this.confirmationDialogService.confirm('Confirmación', '¿Desea eliminar el registro?')
    .then((confirmed) => {
      if (confirmed) {
        this.service.delete(Constants.Order, id)
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

  goEdit(id: number) {
    this.router.navigate(['/order', 'edit', id]);
  }

}
