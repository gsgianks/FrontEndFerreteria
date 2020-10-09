import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Credit } from 'src/app/domain/Credit';
import { Subject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { FormUtils } from '../../shared/formUtils';
import { takeUntil, startWith, map } from 'rxjs/operators';
import * as alertify from 'alertifyjs';
import { User } from 'src/app/domain/User';
import { Product } from 'src/app/domain/Product';
import { Constants } from 'src/app/common/Constants';
import { CreditTableComponent } from '../credit-table/credit-table.component';

const FIELD_REQUIRED = 'Campo Requerido.';

@Component({
  selector: 'mot-credit-edit',
  templateUrl: './credit-edit.component.html',
  styleUrls: ['./credit-edit.component.scss']
})
export class CreditEditComponent implements OnInit {

  @ViewChild(CreditTableComponent, {static: false}) child:CreditTableComponent;

  form: FormGroup;
  model: Credit = null;
  updating = false;
  idUser: number = null;
  modelUser: User = null;
  productControl = new FormControl();
  products: Product[] = null;
  estado = Constants.Pendiente; // Estado para cargar los créditos
  filteredProducts: Observable<Product[]>;

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
    },
    precio_Total: {
      required: FIELD_REQUIRED
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: BaseService<Credit>,
    private serviceUser: BaseService<User>,
    private serviceProduct: BaseService<Product>,
    private fb: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService
  ) { 
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [''],
      id_Usuario: ['', [Validators.required]],
      id_Producto: ['', [Validators.required]],
      nombre_Producto: ['', [Validators.required]],
      precio_Venta_Producto: ['', [Validators.required]],
      cantidad: ['', [Validators.required]],
      precio_Total: ['', [Validators.required]]
    });

    const fieldsToWatch = [
      'id_Usuario',
      'id_Producto',
      'nombre_Producto',
      'precio_Venta_Producto',
      'cantidad',
      'precio_Total'
    ];
    if (this.model) {
      FormUtils.toFormGroup(this.form, this.model);
      this.form.controls.id_Usuario.setValue(this.idUser);
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

  getAllProduct(){
    this.serviceProduct.getAll(Constants.Product).subscribe(res => {
      this.products = res.items
      this.filteredProducts = this.productControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
    
  }

  ngOnInit() {
    
    this.idUser = +this.route.snapshot.paramMap.get('id');
    var origen = this.route.snapshot.paramMap.get('origen')

    if(origen === 'user'){
      this.serviceUser.getById(Constants.User, this.idUser).subscribe(res => { 
        if(res.codigo == 0){
          this.modelUser = res.items[0];
        }else{
          alertify.error(res.descripcion);
        }
      });

      this.model = { id: 0 } as Credit;
      this.createForm();
      this.getAllProduct();
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
    this.service.post(Constants.Credit, this.model)
      .subscribe(res => {
        if (res.codigo === 0) {
          this.createForm();
          this.productControl.setValue('');
          alertify.success(res.descripcion);
          this.child.getAll();
        } else {
          alertify.error(res.descripcion);
        }
      });
  }

  goToList(): void {
    this.router.navigate(['./credit']);
  }

  delete(id: number): void {

    this.confirmationDialogService.confirm('Confirmación', '¿Desea eliminar el registro?')
    .then((confirmed) => {
      if (confirmed) {
        this.service.delete(Constants.Credit, id)
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

  private _filter(value: String): Product[] {
    const filterValue = value.toLowerCase(); 
    return this.products.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0).map((a) => {return a;});
  }

  changeProduct(e){
    const product = this.products.find(p => p.nombre === e);

    if(product){
      this.form.controls.id_Producto.setValue(product.id);
      this.form.controls.precio_Venta_Producto.setValue(product.precio_Venta);
      this.form.controls.cantidad.setValue(1);
      this.form.controls.nombre_Producto.setValue(product.nombre);
      this.form.controls.precio_Total.setValue(product.precio_Venta);
    }else{
      this.form.controls.id_Producto.setValue(null);
      this.form.controls.precio_Venta_Producto.setValue(null);
      this.form.controls.cantidad.setValue(null);
      this.form.controls.nombre_Producto.setValue(null);
      this.form.controls.precio_Total.setValue(null);
    }
  }

  changeTotalPrice(){
    this.form.controls.precio_Total.setValue(this.form.value['cantidad']*this.form.value['precio_Venta_Producto']);
  }

}
