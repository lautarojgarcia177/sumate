import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductosService } from 'src/app/providers/productos.service';
import { CurrenciesService } from 'src/app/providers/currencies.service';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriasService } from 'src/app/providers/categorias.service';
import { forkJoin, Subscription } from 'rxjs';
import { Currency } from 'src/app/models/currency.model';
import { Category } from 'src/app/models/categoria.model';
import { imgValidation } from 'src/app/shared/custom-validators/img-validation';
import { SeleccionarCategoriaComponent } from './seleccionar-categoria/seleccionar-categoria.component';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css'],
  providers: [ProductosService, CurrenciesService, CategoriasService]
})
export class EditarProductoComponent implements OnInit, AfterViewChecked {

  title: string;
  selectedProduct;

  allcurrencies: Currency[];
  allCategories: Category[];

  error: Error;

  isLoading = true;
  Swal = Swal;

  yaCorrio = false;

  nullimg: string = '/assets/img/no-img-placeholder.png';

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  forma = this.fb.group({
    Nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    Descripcion: ['', [Validators.maxLength(160)]],
    Precio: ['', [Validators.required, Validators.min(0)]],
    Moneda: ['', [Validators.required]],
    WebSite: [''],
    Logo: ['', imgValidation],
    //Categorias: [''],
  });

  @ViewChild(SeleccionarCategoriaComponent) categoriasSortable: SeleccionarCategoriaComponent;

  constructor(public bsModalRef: BsModalRef,
              private productsService: ProductosService,
              private currenciesService: CurrenciesService,
              private categoriesService: CategoriasService,
              private fb: FormBuilder,
              private bsModalService: BsModalService) { }

  ngOnInit(): void {
    this.obtenerLaData();
    this.inicializarFormulario();
  }

  ngAfterViewChecked() {
    if (this.yaCorrio === false && this.categoriasSortable) {
        this.productsService.getAll().subscribe(productos => {
          let _selectedProduct = productos.find(p => p.Name === this.selectedProduct.Nombre);
          this.categoriasSortable.setSelectedCategories(_selectedProduct.Categories);
          this.yaCorrio = true;
        });
    }
  }

  obtenerLaData(): void {
    forkJoin(
      this.productsService.getAll(),
      this.currenciesService.getAll(),
      this.categoriesService.getAll()
    ).subscribe(([products, currencies, categories]) => {
      if (this.selectedProduct) {
        this.selectedProduct.Descripcion = products.filter(c => c.Name === this.selectedProduct.Nombre)[0].Description;
      }
      this.allcurrencies = currencies;
      this.allCategories = categories;
      this.isLoading = false;
    });
  }

  inicializarFormulario(): void {
    if (this.title === 'Editar Producto') {
      this.currenciesService.getCurrencyIdByCode(this.obtenerPrecio().moneda).subscribe(idMoneda => {
        this.productsService.getAll().subscribe(productos => {
          let _selectedProduct = productos.find(p => p.Name === this.selectedProduct.Nombre);
          this.selectedProduct.Descripcion = _selectedProduct.Description;
          this.selectedProduct.WebSite = _selectedProduct.WebSite;
          this.selectedProduct.Logo = _selectedProduct.Logo;
          this.forma.reset({
            Nombre: this.selectedProduct.Nombre,
            Descripcion: this.selectedProduct.Descripcion,
            Precio: this.obtenerPrecio().precio,
            Moneda: idMoneda,
            WebSite: this.selectedProduct.WebSite,
            Logo: this.formatLogo(this.selectedProduct.Logo),
          });
        });
      });
    }
  }

  obtenerPrecio() {
    const precioYMoneda = this.selectedProduct.Precio.split(' ');
    return {
      precio: precioYMoneda[0],
      moneda: precioYMoneda[1]
    }
  }

  formatLogo(logo: string) {
    return logo.substr(43,logo.length-45);
  }

  public esNombreYaTomado(): void {
    this.productsService.isNameTaken(this.forma.get('Nombre').value).subscribe(isTaken => {
      if (isTaken) {
        this.forma.get('Nombre').setErrors({notUnique: true});
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    const reqProduct: Product = {
      Name: this.forma.get('Nombre').value,
      Description: this.forma.get('Descripcion').value,
      Logo: this.forma.get('Logo').value,
      WebSite: this.forma.get('WebSite').value,
      Price: this.forma.get('Precio').value,
      CurrencyId: this.forma.get('Moneda').value,
      Categories: this.categoriasSortable.selectedCategories
    }
    if (this.title === 'Nuevo Producto') {
      this.productsService.add(reqProduct).subscribe(() => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Se ha registrado el nuevo producto',
          showConfirmButton: false,
          timer: 1500
        })
        this.bsModalRef.hide();
      },
      error => this.error = error)
    } else {

    }
  }

  showState() {
    
    console.log('categorias sortable',this.categoriasSortable);
  }

  eliminar() {
    this.isLoading = true;
    this.productsService.getProductIdByName(this.selectedProduct.Nombre)
      .subscribe(id => {
         this.productsService.delete(id).subscribe(res => {
           this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Se ha eliminado el producto',
            showConfirmButton: false,
            timer: 1500
          });
          this.bsModalRef.hide();
        },
        error => this.error = error); 
      });
  }

}
