import { Component, OnInit } from '@angular/core';
import * as alertify from 'alertifyjs';
import { BaseService } from 'src/app/services/base.service';
import { Category } from 'src/app/domain/Category';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { FormUtils } from '../../shared/formUtils';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/common/Constants';

const FIELD_REQUIRED = 'Campo Requerido.';
const FIELDMA_MAXLEN_2 = 'Minimo 2 digitos.';
const FIELD_MAXLEN_120 = 'Máximo 120 caracteres.';
const FIELD_EMAIL = 'Email no válido.';
@Component({
  selector: 'ferr-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {


  form: FormGroup;
  model: Category = null;
  updating = false;

  private ngUnsubscribe: Subject<boolean> = new Subject();

  messages: any = {};
  formMessages: any = {
      
      descripcion: {
        required: FIELD_REQUIRED,
      }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: BaseService<Category>,
    private fb: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService
  ) {
   }

  createForm(): void {
    this.form = this.fb.group({
      id: [null],
      descripcion: ['', [Validators.required]]
    });

    const fieldsToWatch = [
      'descripcion',
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
      this.service.getById(Constants.Category,id).subscribe( res => {
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
      } as Category;
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
      this.service.update(Constants.Category, this.model).subscribe(res => {
        if (res.codigo === 0) {
          alertify.success(res.descripcion);
        } else {
          alertify.error(res.descripcion);
        }
      });
    } else {
      this.service.post(Constants.Category,this.model).subscribe(res => {
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
    this.router.navigate(['./category']);
  }

  delete(id: number): void {

    this.confirmationDialogService.confirm('Confirmación', '¿Desea eliminar el registro?')
    .then((confirmed) => {
      if (confirmed) {
        this.service.delete(Constants.Category, id)
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