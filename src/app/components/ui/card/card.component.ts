import { ProductosService } from './../../../providers/productos.service';
import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() img: string;
  @Input() title: string;
  @Input() text: string;
  @Input() isSubCategory: boolean = false;
  @Input() subCategories: any[] = [];

  isNotCollapsed = false;

  error: Error;

  constructor(private productosService: ProductosService) { }

  ngOnInit(): void {
    this.productosService.getAll().subscribe((res: Product[]) => {
      this.mapearSubCategoriasConProductosIds(res);
    },
    error => this.error = error)
  }

  private productNames: string[];

  mapearSubCategoriasConProductosIds(productos: Array<any>) {
    this.subCategories.forEach(sc => {
      this.productNames = [];
      sc.Products.forEach(scp => {
        productos.forEach(p => {
          if (p.Id === scp) {
            this.productNames.push(p.Name)
          }
        })
      });
      if (this.productNames.length > 0 ) {
        sc.productNames = this.productNames;
      } else {
        sc.productNames = ['No hay ningun producto de esta categoría'];
      }
    });
  }

}
