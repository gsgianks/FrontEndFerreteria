import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { User } from 'src/app/domain/User';
import { BaseService } from 'src/app/services/base.service';
import { Router } from '@angular/router';
import * as alertify from 'alertifyjs';
import { Constants } from 'src/app/common/Constants';
import { Credit } from 'src/app/domain/Credit';

@Component({
  selector: 'ferr-credit-user-list',
  templateUrl: './credit-user-list.component.html',
  styleUrls: ['./credit-user-list.component.scss']
})
export class CreditUserListComponent implements OnInit {

  displayedColumns: string[] = [
    'nombre_Usuario',
    'saldo',
    'descripcion_Estado',
    'actionsColumn'
  ];
  dataSource: MatTableDataSource<Credit>;
  rowData: Credit[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private service: BaseService<Credit>,
    private router: Router
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
    this.service.getAll(Constants.Credit + '/CreditoUsuario')
    .subscribe(
      response => {
        this.dataSource.data = response.items;
      }
    );
  }

  goEdit(id: number) {
    this.router.navigate(['/credit', 'edit', id, 'user']);

  }

  goPay(id: number) {
    this.router.navigate(['/creditpayment', 'edit', id, 0, 'pay']);
  }

  showError(error: any): void {
    const msg: string = (error && error.error && error.error.error && error.error.error.message) || error.message;
    alertify.error(msg);
  }

}
