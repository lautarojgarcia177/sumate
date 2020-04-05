import { Observable, observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { HelperErrorHandlerService } from './helper-error-handler.service';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService extends GenericService<Product> {

  constructor(protected http: HttpClient,
              protected errorHandlerService: HelperErrorHandlerService) { 
    super(http, errorHandlerService, '*/products')
  }

  public obtenerProductosPorIds(ids: number[]): Observable<any> {
    let productos = [];
    let obs = new Observable(suscriber => {
      this.getAll().subscribe((res: Array<any>) => {
        res.forEach(p => {
          if (ids.includes(p.Id)) {
            productos.push(p);
          }
        });
        suscriber.next(productos);
        suscriber.complete();
      })
    })
    return obs;
  }

  public obtenerNombresDeProductosPorIdsAsync(ids: number[]): Observable<any> {
    let obs = new Observable(suscriber => {
      let nombresDeProductos = [];
      this.obtenerProductosPorIds(ids).subscribe(res => {
        res.forEach(x => {
          nombresDeProductos.push(x.Name);
        });
        suscriber.next(nombresDeProductos);
        suscriber.complete();
      });
    })
    return obs;
  }
}
