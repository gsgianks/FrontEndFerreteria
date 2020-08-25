import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { User } from 'src/app/domain/User';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { FormUtils } from '../../shared/formUtils';
import * as alertify from 'alertifyjs';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';

const FIELD_REQUIRED = 'Campo Requerido.';
const FIELD_MAXLEN_10 = 'Máximo 10 digitos.';
const FIELD_EMAIL = 'Email no válido.';


@Component({
  selector: 'mot-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  form: FormGroup;
  model: User = null;
  updating = false;

  private ngUnsubscribe: Subject<boolean> = new Subject();

  messages: any = {};
  formMessages: any = {
    nombre: {
      required: FIELD_REQUIRED
    },
    apellidos: {
      required: FIELD_REQUIRED
    },
    identificacion: {
      required: FIELD_REQUIRED
    },
    correo_Electronico: {
      required: FIELD_REQUIRED,
      email: FIELD_EMAIL
    },
    direccion: {
      required: FIELD_REQUIRED
    },
    celular: {
      required: FIELD_REQUIRED,
      maxlength: FIELD_MAXLEN_10
    },
    telefono: {
      maxlength: FIELD_MAXLEN_10
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: UserService,
    private fb: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  createForm(): void {
    this.form = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(60)]],
      identificacion: ['', [Validators.required, Validators.maxLength(15)]],
      correo_Electronico: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      direccion: ['', [Validators.required, Validators.maxLength(250)]],
      celular: ['', [Validators.required, Validators.maxLength(10)]],
      telefono: ['', [Validators.maxLength(10)]]
    });

    const fieldsToWatch = [
      'nombre',
      'identificacion',
      'correo_Electronico',
      'direccion',
      'celular',
      'telefono'
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
      } as User;
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
    this.router.navigate(['./user']);
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
