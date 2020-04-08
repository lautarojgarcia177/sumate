import { Company } from './../../../models/company.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';
import { ProductosService } from 'src/app/providers/productos.service';
import { Product } from 'src/app/models/product.model';
import { CurrenciesService } from 'src/app/providers/currencies.service';
import { Observable, forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-productos-edicion',
  templateUrl: './productos-edicion.component.html',
  styleUrls: ['./productos-edicion.component.css'],
  providers: [
    ProductosService, CurrenciesService
  ]
})
export class ProductosEdicionComponent implements OnInit {

    isLoading = true;
  
    limit = 10;
    rows = [];
    temp = [];
    filterquery = new FormControl('');
    selected = [];
    columns = [
      {prop: 'Nombre'},
      {prop: 'WebSite'},
      {prop: 'Logo'},
      {prop: 'Precio'}
    ];
    ColumnMode = ColumnMode;
    SelectionType = SelectionType;
    allProducts;
  
    limitControl: FormControl;
  
    @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  
    modalRef: BsModalRef;
    subscriptions: Subscription[] = [];
  
    constructor(private productosService: ProductosService,
                private currenciesService: CurrenciesService,
                private bsModalService: BsModalService) { }
  
    ngOnInit(): void {
      this.obtenerLaData();
    }
  
    obtenerLaData(): void {
      forkJoin(
        this.currenciesService.getAll(),
        this.productosService.getAll(),
      )
      .subscribe(([res1, res2]) => {
        if (this.limit > res2.length) {
          this.limit = res2.length;
        }
        this.allProducts = res2.map(p => {
          if (p.Price && p.CurrencyId) {
            p.PriceWithCurrency = String(p.Price) + ' ' + res1.find(c => c.Id === p.CurrencyId).Code;
          } else {
            p.PriceWithCurrency = '';
          }
          return p;
        });
        this.limitControl = new FormControl(this.limit, Validators.max(this.limit));
        this.transformarProductos(this.allProducts);
        this.isLoading = false;
      });
    }
  
     transformarProductos(res): void {
      let aux: Product[] = res;
      this.rows = aux.map(curr => {
          return {
            Nombre: curr.Name,
            WebSite: this.formatearWebsite(curr.WebSite),
            Logo: this.formatearLogo(curr.Logo),
            Precio: curr.PriceWithCurrency
          }
      });
      this.temp = this.rows;
    } 
  
    formatearLogo(logo: string): string {
      if (logo) {
        logo = '<img class="category-logo rounded-lg" src="' + logo + '">';
      } else {
        logo = '<img class="category-logo rounded-lg" src="/assets/img/no-img-placeholder.png">';
      }
      return logo;
    }
  
    formatearWebsite(website: string): string {
      if (website) { 
        if (website.startsWith('https://') || website.startsWith('http://')) {
          const inicio = ' <a href="';
          const mid = '" target="_blank" >';
          const fin = '</a>';
          return inicio + website + mid + website + fin ;
        } else {       
          const inicio = ' <a href="https://';
          const mid = '" target="_blank" >';
          const fin = '</a>';
          return inicio + website + mid + website + fin ;
        }
      } else {
        return '';
      }
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
  
    refreshTable() {
      this.rows = [...this.rows];
      window.location.reload();
    }
  
    nuevoProducto() {
      const config = {
        keyboard: true,
        initialState: {
          title: 'Nuevo Producto'
        }
      };
      this.modalRef = this.bsModalService.show(EditarProductoComponent, config);
  
      this.subscriptions.push(
        this.bsModalService.onHide.subscribe((reason: string) => {
          if(reason !== 'backdrop-click') {
            this.refreshTable();
          }
        })
      );
    }

    editarProducto(event) {
      const config = {
        keyboard: true,
        initialState: {
          title: 'Editar Producto',
          selectedProduct: event.selected[0]
        }
      }
      this.modalRef = this.bsModalService.show(EditarProductoComponent, config);
  
      this.subscriptions.push(
        this.bsModalService.onHide.subscribe(() => {
          this.refreshTable()
        })
      );
    }
  
    hoverRed(row) {
      return 'hoverRow';
    }
  
    onLimitChange(): void {
      if(this.limitControl.value > this.limit) {
        this.limitControl.setValue(this.limit);
      }
      if(this.limitControl.value < 0) {
        this.limitControl.setValue(0);
      }
   }
    
  }
  
  