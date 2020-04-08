import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProductosService } from 'src/app/providers/productos.service';
import { CurrenciesService } from 'src/app/providers/currencies.service';

@Component({
  selector: 'app-productos-detalle',
  templateUrl: './productos-detalle.component.html',
  styleUrls: ['./productos-detalle.component.css'],
  providers: [ProductosService, CurrenciesService]
})
export class ProductosDetalleComponent implements OnInit {

  selectedProduct;

  error: Error;

  isLoading = true;

  constructor(public bsModalRef: BsModalRef,
              private productsService: ProductosService
              ) { }

  ngOnInit(): void {
    this.obtenerLaData();  }

  obtenerLaData() {
      this.productsService.getAll().subscribe(products => {
        this.selectedProduct.Descripcion = products.filter(c => c.Name === this.selectedProduct.Nombre)[0].Description;
        this.isLoading = false;
      });
  }

}
