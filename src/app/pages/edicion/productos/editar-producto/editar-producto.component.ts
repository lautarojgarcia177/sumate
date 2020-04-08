import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProductosService } from 'src/app/providers/productos.service';
import { CurrenciesService } from 'src/app/providers/currencies.service';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriasService } from 'src/app/providers/categorias.service';
import { forkJoin } from 'rxjs';
import { Currency } from 'src/app/models/currency.model';
import { Category } from 'src/app/models/categoria.model';
import { imgValidation } from 'src/app/shared/custom-validators/img-validation';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css'],
  providers: [ProductosService, CurrenciesService, CategoriasService]
})
export class EditarProductoComponent implements OnInit {

  title: string;
  selectedProduct;

  allcurrencies: Currency[];
  allCategories: Category[];

  error: Error;

  isLoading = true;
  Swal = Swal;

  nullimg: string = '/assets/img/no-img-placeholder.png';

  forma = this.fb.group({
    Nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    Descripcion: [''],
    Precio: ['', [Validators.required, Validators.min(0)]],
    Moneda: ['', [Validators.required]],
    WebSite: [''],
    Logo: ['', imgValidation],
    //Categorias: [''],
  })

  constructor(public bsModalRef: BsModalRef,
              private productsService: ProductosService,
              private currenciesService: CurrenciesService,
              private categoriesService: CategoriasService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.obtenerLaData();
    this.inicializarFormulario();
  }

  obtenerLaData(): void {
    forkJoin(
      this.productsService.getAll(),
      this.currenciesService.getAll(),
      this.categoriesService.getAll()
    ).subscribe(([products, currencies, categories]) => {
      this.selectedProduct.Descripcion = products.filter(c => c.Name === this.selectedProduct.Nombre)[0].Description;
      this.allcurrencies = currencies;
      this.allCategories = categories;
      this.isLoading = false;
    });
  }

  inicializarFormulario(): void {
    if (this.title === 'Editar Producto') {

    }
  }

  formatLogo(logo: string) {
    return logo.substr(43,logo.length-45);
  }

  public esNombreYaTomado(): void {
    this.productsService.isNameTaken(this.forma.get('Name').value).subscribe(isTaken => {
      if (isTaken) {
        this.forma.get('Name').setErrors({notUnique: true});
      }
    });
  }

  onSubmit() {

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
