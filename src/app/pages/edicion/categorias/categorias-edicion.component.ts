import { Router, ActivatedRoute } from '@angular/router';
import { ProductosService } from './../../../providers/productos.service';
import { Category } from './../../../models/categoria.model';
import { switchMap, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {ColumnMode, SelectionType} from '@swimlane/ngx-datatable';
import { CategoriasService } from 'src/app/providers/categorias.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EditarCategoriaComponent } from './editar-categoria/editar-categoria.component';
import { Product } from 'src/app/models/product.model';
import { Observable, forkJoin, pipe, Subscription } from 'rxjs';

@Component({
  selector: 'app-categorias-edicion',
  templateUrl: './categorias-edicion.component.html',
  styleUrls: ['./categorias-edicion.component.css'],
  providers: [
    CategoriasService,
    { provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }
  ]
})
export class CategoriasEdicionComponent implements OnInit{
  
  allCategories;
  isLoading = true;
  
  limit = 10;
  filterquery = new FormControl('');

  mitabla = new FormControl('');

  limitControl: FormControl;

  rows = [
  ];

  temp = [];
  selected = [];

  columns = [
    {prop: 'Nombre'},
    {prop: 'Categoria'},
    {prop: 'Logo'},
    {prop: 'Productos'},
  ];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  //allproducts: Product[];
  //allcategories;

  constructor(private categoriasService: CategoriasService,
              private productosService: ProductosService,
              private bsmodalservice: BsModalService) {}

  ngOnInit() {
    this.obtenerLaData();
  }

  obtenerLaData(): void {
    forkJoin(
      this.categoriasService.getAll(),
      this.productosService.getAll(),
    )
    .subscribe(([res1, res2]) => {
      //this.allproducts = res2;
      this.transformarCategorias(res1);
      this.allCategories = res1;
      if (this.limit > res1.length) {
        this.limit = res1.length;
      }
      this.limitControl = new FormControl(this.limit, Validators.max(this.limit));
      this.isLoading = false;
    });
  }

  transformarCategorias(res): void {
    let aux: Category[] = res;
    aux.map(cat => {
      if (cat.Logo) {
        cat.Logo = '<img class="category-logo rounded-lg" src="' + cat.Logo + '">';
      } else {
        cat.Logo = '<img class="category-logo rounded-lg" src="/assets/img/no-img-placeholder.png">';
      }
    });
    this.rows = aux.map(c => {
      let nombreCatPadre: string;
      try {
        nombreCatPadre = aux.find(item => item.Id === c.ParentId).Name;
      } catch(e) {
        nombreCatPadre = '';
      }    
      return {
        Nombre: c.Name,
        Categoria: nombreCatPadre,
        Logo: c.Logo,
        Productos: this.obtenerNombresDeProductosPorIdsSync(c.Products).join(', ')
      }
    });
    this.temp = this.rows;    
  }
 
  private obtenerNombresDeProductosPorIdsSync(ids: number[]): Array<string> {
    let nombresDeProductos = [];
    
    this.productosService.getAll().subscribe(allproducs => {
      allproducs.forEach(p => {
        if (ids.includes(p.Id)) {
          nombresDeProductos.push(p.Name);
        }
      });
    });/* 

    this.allproducts.forEach(p => {
      if (ids.includes(p.Id)) {
        nombresDeProductos.push(p.Name);
      }
    }); */
    return nombresDeProductos;
  } 

  updateFilter(event?) {
    let val;
    if(event) {
       val = event.target.value.toLowerCase();
    } else {
      val = '';
    }

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.Nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  clearFilter() {
    this.filterquery.reset();
    this.updateFilter()
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  hoverRed(row) {
    return 'hoverRow';
  }

  refreshTable() {
    this.obtenerLaData();
    this.rows = [...this.rows];
    window.location.reload();
  }

  nuevaCategoria() {
    const config = {
      keyboard: true,
      initialState: {
        title: 'Nueva Categoria',
        categories: this.filtrarCategoriasPadres(),
      }
    };
    this.modalRef = this.bsmodalservice.show(EditarCategoriaComponent, config);

    this.subscriptions.push(
      this.bsmodalservice.onHide.subscribe((reason: string) => {
        if(reason !== 'backdrop-click') {
          this.refreshTable();
        }
      })
    );
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
  }

  editarCategoria(event) {
    this.productosService.obtenerProductosPorIds(event.selected[0].Productos).subscribe(prods => {
      const config = {
        keyboard: true,
        initialState: {
          title: 'Editar Categoria',
          categories: this.filtrarCategoriasPadres(),
          products: this.productosService.getAll(),
          selectedCategory: event.selected[0],
          categoryProducts: prods
        }
      };
      this.modalRef = this.bsmodalservice.show(EditarCategoriaComponent, config);

      this.subscriptions.push(
        this.bsmodalservice.onHide.subscribe(() => {
          this.refreshTable()
        })
      );
    });
  }

  filtrarCategoriasPadres(): Array<any> {
    let catPadres: Array<any>;
    catPadres = this.rows.filter(c => c.Categoria === '');
    return catPadres;
  }

  onLimitChange(): void {
    if(this.limitControl.value > this.allCategories.length) {
      this.limitControl.setValue(this.allCategories.length);
    }
    if(this.limitControl.value < 0) {
      this.limitControl.setValue(0);
    }
 }

}
