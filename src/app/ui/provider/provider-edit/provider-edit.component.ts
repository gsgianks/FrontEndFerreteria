import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/common/Constants';
import { Provider } from 'src/app/domain/Provider';
import { BaseService } from 'src/app/services/base.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { FormUtils } from '../../shared/formUtils';
import * as alertify from 'alertifyjs';

const FIELD_REQUIRED = 'Campo Requerido.';

@Component({
  selector: 'mot-provider-edit',
  templateUrl: './provider-edit.component.html',
  styleUrls: ['./provider-edit.component.scss']
})

export class ProviderEditComponent implements OnInit {

  form: FormGroup;
  model: Provider = null;
  updating = false;

  private ngUnsubscribe: Subject<boolean> = new Subject();

  messages: any = {};
  formMessages: any = {
      
      nombre_Proveedor: {
        required: FIELD_REQUIRED,
      },
      telefono: {
        required: FIELD_REQUIRED,
      },
      correo_Electronico: {
        required: FIELD_REQUIRED,
      }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: BaseService<Provider>,
    private fb: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService
  ) {
   }

  createForm(): void {
    this.form = this.fb.group({
      id: [null],
      nombre_Proveedor: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo_Electronico: ['', [Validators.required, Validators.email]],
    });

    const fieldsToWatch = [
      'nombre_Proveedor',
      'telefono',
      'correo_Electronico',
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
      this.service.getById(Constants.Provider,id).subscribe( res => {
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
      } as Provider;
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
      console.log(this.form);
      alertify.error('Formulario inválido');
    } else {
      FormUtils.toModel(this.form, this.model);
      this.saveModel();
    }
    return false;
  }

  saveModel(): void {
    if (this.model.id) {
      this.service.update(Constants.Provider, this.model).subscribe(res => {
        if (res.codigo === 0) {
          alertify.success(res.descripcion);
        } else {
          alertify.error(res.descripcion);
        }
      });
    } else {
      this.service.post(Constants.Provider,this.model).subscribe(res => {
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
    this.router.navigate(['./provider']);
  }

  delete(id: number): void {

    this.confirmationDialogService.confirm('Confirmación', '¿Desea eliminar el registro?')
    .then((confirmed) => {
      if (confirmed) {
        this.service.delete(Constants.Provider, id)
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