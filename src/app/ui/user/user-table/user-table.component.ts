import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { User } from 'src/app/domain/User';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import * as alertify from 'alertifyjs';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'mot-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {

  displayedColumns: string[] = [
    'nombre',
    'identificacion',
    'direccion',
    'correo_Electronico',
    'celular',
    'telefono',
    'rol',
    'actionsColumn'
  ];
  dataSource: MatTableDataSource<User>;
  rowData: User[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private service: UserService,
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
    // console.log(data);
    this.router.navigate(['/user', 'edit', id]);

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
