
import { Component, ViewChild, Input } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { CreditPayment } from 'src/app/domain/Credit-Payment';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { Constants } from 'src/app/common/Constants';
import { CreditTableComponent } from '../../credit';

@Component({
  selector: 'mot-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: [ './payment-history.component.scss' ]
})
export class PaymentHistoryComponent  {
  displayedColumns: string[] = [
    // 'nombre_Usuario',
    'monto',
    'abono',
    'saldo',
    'fecha_Creacion',
    'actionsColumn'
  ];
  dataSource: MatTableDataSource<CreditPayment>;
  rowData: CreditPayment[] = [];
  estado: string = Constants.Pagado; // Estado para cargar los créditos
  isHidden = true;
  paymentModel: CreditPayment = null;
  @Input() idUser: number;
  @Input() idPay: number;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(CreditTableComponent, {static: false}) creditList: CreditTableComponent;

  constructor(
    private service: BaseService<CreditPayment>,
    private router: Router
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
    this.service.getById(Constants.CreditPayment + '/PorUsuario', this.idUser)
    .subscribe(
      response => {
        this.dataSource.data = response.items;

        // Si el idPay no es cero muestra el Pago y la lista de crédito.
        if (this.idPay !== 0) {
          this.isHidden = false;
          this.paymentModel = this.dataSource.data.find(item => item.id === this.idPay);
        }
      }
    );
  }

  setIdPago(id: number): void {
    this.creditList.idPago = id;
    this.creditList.getAll();
    this.isHidden = false;
    this.paymentModel = this.dataSource.data.find(item => item.id === id);
  }
}

