import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Credit } from 'src/app/domain/Credit';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { FormUtils } from '../../shared/formUtils';
import { takeUntil } from 'rxjs/operators';
import * as alertify from 'alertifyjs';
import { User } from 'src/app/domain/User';

const FIELD_REQUIRED = 'Campo Requerido.';

@Component({
  selector: 'mot-credit-edit',
  templateUrl: './credit-edit.component.html',
  styleUrls: ['./credit-edit.component.scss']
})
export class CreditEditComponent implements OnInit {

  form: FormGroup;
  model: Credit = null;
  updating = false;
  modelUser: User = null;

  private ngUnsubscribe: Subject<boolean> = new Subject();

  messages: any = {};
  formMessages: any = {
    id_Usuario: {
      required: FIELD_REQUIRED
    },
    id_Producto: {
      required: FIELD_REQUIRED
    },
    nombre_Producto: {
      required: FIELD_REQUIRED
    },
    precio_Venta_Producto: {
      required: FIELD_REQUIRED
    },
    cantidad: {
      required: FIELD_REQUIRED
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: BaseService<Credit>,
    private serviceUser: BaseService<User>,
    private fb: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService
  ) { 
    this.service.Api = 'Credito';
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [''],
      id_Usuario: ['', [Validators.required]],
      id_Producto: ['', [Validators.required]],
      nombre_Producto: ['', [Validators.required]],
      precio_Venta_Producto: ['', [Validators.required]],
      cantidad: ['', [Validators.required]]
    });

    const fieldsToWatch = [
      'id_Usuario',
      'id_Producto',
      'nombre_Producto',
      'precio_Venta_Producto',
      'cantidad'
    ];
    if (this.model) {
      FormUtils.toFormGroup(this.form, this.model);
    }
    fieldsToWatch.forEach(x => this.addFieldWatch(this.form.get(x), this.messages, this.formMessages, x));
  }

  addFieldWatch(ctrl: AbstractControl, errorMessages: any, defaultMessages: any, name: string): void {
    ctrl.valueChanges
      // the operator takeUntil will keep alive the subscription until the Subject tells
      // them to complete (see ngOnDestroy below)
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
    var origen = this.route.snapshot.paramMap.get('origen')
    console.log(origen);
    if(origen.toString() == 'id'){
      if (id) {
        this.service.getById(id).subscribe( res => {
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
        } as Credit;
        FormUtils.toFormGroup(this.form, this.model);
      }
    }else if(origen.toString() == 'user'){
      this.serviceUser.Api = 'Usuario';
      this.serviceUser.getById(id).subscribe(res => { this.modelUser = res.items[0] });
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
      this.service
        .update(this.model)
        .subscribe(res => {
          if (res.codigo === 0) {
            alertify.success(res.descripcion);
          } else {
            alertify.error(res.descripcion);
          }
        });
    } else {
      this.service
        .insert(this.model)
        .subscribe(res => {
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
    this.router.navigate(['./credit']);
  }

  delete(id: number): void {

    this.confirmationDialogService.confirm('Confirmación', '¿Desea eliminar el registro?')
    .then((confirmed) => {
      if (confirmed) {
        this.service.delete(id)
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

}
