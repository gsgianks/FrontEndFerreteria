import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/common/Constants';
import { Order } from 'src/app/domain/Order';
import { BaseService } from 'src/app/services/base.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { FormUtils } from '../../shared/formUtils';
import * as alertify from 'alertifyjs';

const FIELD_REQUIRED = 'Campo Requerido.';

@Component({
  selector: 'ferr-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {

  form: FormGroup;
  model: Order = null;
  updating = false;

  private ngUnsubscribe: Subject<boolean> = new Subject();

  messages: any = {};
  formMessages: any = {
      
      id_Usuario: {
        required: FIELD_REQUIRED,
      },
      direccion: {
        required: FIELD_REQUIRED,
      }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: BaseService<Order>,
    private fb: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService
  ) {
   }

  createForm(): void {
    this.form = this.fb.group({
      id: [null],
      id_Usuario: ['', [Validators.required]],
      nombre_Usuario: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      fecha_Entrega: ['', [Validators.required]],
    });

    const fieldsToWatch = [
      'id_Usuario',
      'nombre_Usuario',
      'direccion' ,
      'fecha_Entrega',
    ];

    if (this.model) {
      FormUtils.toFormGroup(this.form, this.model);
    }
    fieldsToWatch.forEach(x => this.addFieldWatch(this.form.get(x), this.messages, this.formMessages, x));
  }

  addFieldWatch(ctrl: AbstractControl, errorMessages: any, defaultMessages: any, name: string): void {
    ctrl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.setMessage(ctrl, errorMessages, defaultMessages, name));
  }

  setMessage(ctrl: AbstractControl, errorMessages: any, defaultMessages: any, name: string): void {
    errorMessages[name] = '';
    if ((ctrl.touched || ctrl.dirty) && ctrl.errors) {
      errorMessages[name] = Object.keys(ctrl.errors)
        .map(key => defaultMessages[name][key])
        .join(' ');
    }
  }

  ngOnInit() {

    this.createForm();

    const id = +this.route.snapshot.paramMap.get('id');

    if (id) {
      this.service.getById(Constants.Order,id).subscribe( res => {
        if (res.codigo === 0) {
          this.model = res.items[0];
          FormUtils.toFormGroup(this.form, this.model);
        } else {
          alertify.error(res.descripcion);
        }
      });
      this.updating = true;
    } else {
      this.model = {
        id: 0
      } as Order;
      FormUtils.toFormGroup(this.form, this.model);
    }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submit() {

    if (!this.form.valid) {
      alertify.error('Formulario inválido');
    } else {
      FormUtils.toModel(this.form, this.model);
      this.saveModel();
    }
    return false;
  }

  saveModel(): void {
    if (this.model.id) {
      this.service.update(Constants.Order, this.model).subscribe(res => {
        if (res.codigo === 0) {
          alertify.success(res.descripcion);
        } else {
          alertify.error(res.descripcion);
        }
      });
    } else {
      this.service.post(Constants.Order,this.model).subscribe(res => {
        if (res.codigo === 0) {
          this.form.controls.id.setValue(res.items[0].id);
          this.model = res.items[0];
          this.updating = true;
          alertify.success(res.descripcion);
        } else {
          alertify.error(res.descripcion);
        }
      });
    }
  }

  goToList(): void {
    this.router.navigate(['./order']);
  }

  delete(id: number): void {

    this.confirmationDialogService.confirm('Confirmación', '¿Desea eliminar el registro?')
    .then((confirmed) => {
      if (confirmed) {
        this.service.delete(Constants.Order, id)
          .subscribe(response => {
            if (response.codigo === 0) {
              alertify.success(response.descripcion);
              this.goToList();
            } else {
              alertify.error(response.descripcion);
            }
          });
      }
    })
    .catch(() => {});
  }

  trackByFn(index: number, model: {Id: number}) {
    return model ? model.Id : undefined;
  }

}
