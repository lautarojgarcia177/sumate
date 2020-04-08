import { CategoriasService } from 'src/app/providers/categorias.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Category } from 'src/app/models/categoria.model';
import Swal from 'sweetalert2';
import { Product } from 'src/app/models/product.model';
import { ProductosService } from 'src/app/providers/productos.service';
import { imgValidation } from 'src/app/shared/custom-validators/img-validation';

@Component({
  selector: 'app-editar-categoria',
  templateUrl: './editar-categoria.component.html',
  styleUrls: ['./editar-categoria.component.css'],
  providers: [CategoriasService]
})
export class EditarCategoriaComponent implements OnInit {

  title: string;
  parentCategories: any[] = [];
  products: any[] = [];
  categoryProducts: Array<any> = [];
  selectedCategory;

  error: Error;

  isLoading = true;
  Swal = Swal;

  nullimg: string = '/assets/img/no-img-placeholder.png';

  forma = this.fb.group({
    Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    Parent: [''],
    Logo: ['', [imgValidation]],
    Products: this.fb.array([])
  });

  constructor(private fb: FormBuilder,
              public bsModalRef: BsModalRef,
              private categoriesService: CategoriasService,
              private productosService: ProductosService) { }

  ngOnInit(): void {
    this.categoriesService.getParentCategories().subscribe(parentcats => {
      this.parentCategories =  parentcats;
      this.inicializarFormulario();
      this.cargarProductos();
      this.isLoading = false;
    });
  }

  cargarProductos() {
    this.productosService.getAll().subscribe(res => {
      this.products = res;
      if (this.title === "Editar Categoria") {
        this.categoriesService.buscarIdDeCategoriaPorNombre(this.selectedCategory.Nombre).subscribe((resId) => {
          this.products.forEach(prod => {
            if (prod.Categories.includes(resId)) {
              prod.pertenece = true;
              this.categoryProducts.push(prod);
            }
          })
        });
      }
    });
  }

  inicializarFormulario(): void {
    if(this.title === 'Editar Categoria') {
      this.forma.reset({
        Name: this.selectedCategory.Nombre,
        Logo: this.formatLogo(this.selectedCategory.Logo),
        Parent: this.selectedCategory.Categoria
      });
    }
  }

  formatLogo(logo: string) {
    return logo.substr(43,logo.length-45);
  }

  onSubmit() {
    this.isLoading = true;
    this.categoriesService.buscarIdDeCategoriaPorNombre(this.forma.get('Parent').value).subscribe(resId => {
      const reqCategory: Category = {
        Name: this.forma.get('Name').value,
        //ParentId: this.buscarIdDeCategoriaPorNombre(this.forma.get('Parent').value),
        ParentId: resId,
        Logo: this.forma.get('Logo').value,
        Products: this.generarArrayDeIdsProductos(this.categoryProducts)
      }
      if (this.title === 'Nueva Categoria') {
        this.categoriesService.add(reqCategory).subscribe(res => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Se ha registrado la nueva categoría',
            showConfirmButton: false,
            timer: 1500
          })
          this.bsModalRef.hide();
        },
        error => this.error = error)
      } else {
        // editar categoria
        this.categoriesService.getCategoryIdByName(this.selectedCategory.Nombre).subscribe(res => {
          this.categoriesService.edit(res, reqCategory).subscribe( o => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Se ha editado la categoría',
              showConfirmButton: false,
              timer: 1500
            });
            this.bsModalRef.hide();
          },
          error => this.error = error);
        });
      }
    });
  }

  public esNombreYaTomado(): void {
    if (this.title === 'Nueva Categorialo' ) {
      this.categoriesService.isNameTaken(this.forma.get('Name').value).subscribe(isTaken => {
        if (isTaken) {
          this.forma.get('Name').setErrors({notUnique: true});
        }
      });
    } else {
      if (this.selectedCategory.Nombre !== this.forma.get('Name').value) {
        this.categoriesService.isNameTaken(this.forma.get('Name').value).subscribe(isTaken => {
          if (isTaken) {
            this.forma.get('Name').setErrors({notUnique: true});
          }
        });
      }
    }
  }

  private generarArrayDeIdsProductos(arr: Product[]): number[] {
    let ret: number[] = [];
    arr.forEach(p => {
      if(p.Id) {
        ret.push(p.Id);
      }
    });
    return ret;
  }

  get nameValue() {
    return this.forma.get('Name').value;
  }

  get logoValue() {
    return this.forma.get('Logo').value;
  }

  get parentValue() {
    return this.forma.get('Parent').value;
  }

  get selectedProducts() {
    return this.forma.get('Products') as FormArray;
  }

  addOrRemoveProduct(product) {
    if (this.categoryProducts.includes(product)) {
      this.categoryProducts = this.categoryProducts.filter(cp => cp !== product);
    } else {
      this.categoryProducts.push(product);
    }
  }

  eliminar() {
    this.isLoading = true;
    this.categoriesService.getCategoryIdByName(this.selectedCategory.Nombre)
      .subscribe(id => {
         this.categoriesService.delete(id).subscribe(res => {
           this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Se ha eliminado la categoría',
            showConfirmButton: false,
            timer: 1500
          });
          this.bsModalRef.hide();
        },
        error => this.error = error); 
      });
  }

}
