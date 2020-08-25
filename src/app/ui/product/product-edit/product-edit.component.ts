import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Product } from 'src/app/domain/Product';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { FormUtils } from '../../shared/formUtils';
import { takeUntil } from 'rxjs/operators';
import * as alertify from 'alertifyjs';
import { BaseService } from 'src/app/services/base.service';
import { Category } from 'src/app/domain/Category';
import { Provider } from 'src/app/domain/Provider';

const FIELD_REQUIRED = 'Campo Requerido.';
const FIELDMA_MAXLEN_2 = 'Minimo 2 digitos.';
const FIELD_MAXLEN_120 = 'Máximo 120 caracteres.';
const FIELD_EMAIL = 'Email no válido.';

@Component({
  selector: 'mot-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  form: FormGroup;
  model: Product = null;
  updating = false;
  categories: Category[] = [];
  providers: Provider[] = [];

  private ngUnsubscribe: Subject<boolean> = new Subject();

  messages: any = {};
  formMessages: any = {
      id_Proveedor: {
        required: FIELD_REQUIRED,
      },
      id_Categoria: {
        required: FIELD_REQUIRED,
      },
      nombre: {
        required: FIELD_REQUIRED,
      },
      precio_Costo: {
        required: FIELD_REQUIRED,
      },
      precio_Venta: {
        required: FIELD_REQUIRED,
      },
      utilidad: {
        required: FIELD_REQUIRED,
      },
      impuesto: {
        required: FIELD_REQUIRED,
      },
      stock: {
        required: FIELD_REQUIRED,
      }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: ProductService,
    private serviceCategory: BaseService<Category>,
    private serviceProvider: BaseService<Provider>,
    private fb: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService
  ) {
   }

  getCategories() {
    this.serviceCategory.Api = 'Categoria';
    this.serviceCategory.getAll().subscribe(res => {
      this.categories = res.items;
    });
  }

  getProviders() {
    this.serviceProvider.Api = 'Proveedor';
    this.serviceProvider.getAll().subscribe(res => {
      this.providers = res.items;
    });
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [null],
      id_Proveedor: ['', [Validators.required]],
      id_Categoria: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      precio_Costo: [null, [Validators.required]],
      precio_Venta: [null, [Validators.required]],
      utilidad: [null, [Validators.required]],
      impuesto: [null, [Validators.required]],
      stock: [null, [Validators.required]],
      descuento: [null],
      codigo_Barra: ['']
    });

    const fieldsToWatch = [
      'id_Proveedor',
      'id_Categoria',
      'nombre',
      'precio_Costo',
      'precio_Venta',
      'utilidad',
      'impuesto',
      'stock'
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
      } as Product;
      FormUtils.toFormGroup(this.form, this.model);
    }

    // Obtener las Categorias
    this.getCategories();
    this.getProviders();
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
      this.service.update(this.model).subscribe(res => {
        if (res.codigo === 0) {
          alertify.success(res.descripcion);
        } else {
          alertify.error(res.descripcion);
        }
      });
    } else {
      this.service.insert(this.model).subscribe(res => {
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
    this.router.navigate(['./product']);
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

  trackByFn(index: number, model: {Id: number}) {
    return model ? model.Id : undefined;
  }

}
