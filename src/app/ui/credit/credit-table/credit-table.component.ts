import { Component, OnInit, ViewChild, Input } from '@angular/core';
import * as alertify from 'alertifyjs';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Credit } from 'src/app/domain/Credit';
import { BaseService } from 'src/app/services/base.service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/common/Constants';

@Component({
  selector: 'mot-credit-table',
  templateUrl: './credit-table.component.html',
  styleUrls: ['./credit-table.component.scss']
})
export class CreditTableComponent implements OnInit {

  displayedColumns: string[] = [
    // 'id_Usuario',
    'nombre_Producto',
    'fecha_Creacion',
    'precio_Venta_Producto',
    'cantidad',
    'precio_Total',
    'descripcion_Estado',
    'actionsColumn'
  ];
  dataSource: MatTableDataSource<Credit>;
  rowData: Credit[] = [];
  @Input() idUsuario: number;
  @Input() estado: string;
  @Input() idPago: number;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private service: BaseService<Credit>,
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
    const model = { id_Usuario: this.idUsuario, estado: this.estado, id_Pago: this.idPago } as Credit;
    this.service.post(Constants.Credit + '/ListaCreditos', model).subscribe(r => {
        if (r.codigo === 0) {
          this.dataSource.data = r.items;
        } else {
          alertify.error(r.descripcion);
        }
      }
    );
  }

  setIdPago(id: number): void {
    this.idPago = id;
  }

  goPay(idUser: number, idPartialPay: number) {
    this.router.navigate(['/creditpayment', 'his', idUser, idPartialPay, 'his']);
  }

  showError(error: any): void {
    const msg: string = (error && error.error && error.error.error && error.error.error.message) || error.message;
    alertify.error(msg);
  }

  delete(id: number): void {

    this.confirmationDialogService.confirm('Confirmación', '¿Desea eliminar el registro?')
    .then((confirmed) => {
      if (confirmed) {
        this.service.delete(Constants.Credit, id)
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

  public calculateTotal() {
    return this.dataSource.data.reduce((accum, curr) => accum + (curr.precio_Total || 0), 0);
  }

}
