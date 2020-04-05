import { Category } from './../models/categoria.model';
import { Observable } from 'rxjs';
import { retry, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperErrorHandlerService } from './helper-error-handler.service';
import { GenericService } from './generic.service';

@Injectable()
export class CategoriasService extends GenericService<Category> {

  constructor(protected http: HttpClient,
              protected errorHandlerService: HelperErrorHandlerService) {
                super(http, errorHandlerService, '*/categories')
              }

  public getCategoryIdByName(name: string): Observable<any> {
    let obs = new Observable(suscriber => {
      this.getAll().subscribe((res: Array<any>) => {
        const id = res.find(c => c.Name === name).Id;
        suscriber.next(id);
        suscriber.complete();
      })
    });
    return obs;
  }

  public buscarIdDeCategoriaPorNombre(nombre: string): Observable<any> {
    let obs = new Observable(suscriber => {
      this.getAll().subscribe(allcategories => {
        suscriber.next(allcategories.find(c => c.Name === nombre).Id);
        suscriber.complete();
     },
     error => {
       this.error = error;
     });
    });
    return obs;
  }

  public getParentCategories(): Observable<any> {
    let obs = new Observable(suscriber => {
      this.getAll().subscribe(res => {
        suscriber.next(res.filter(c => c.ParentId === null));
        suscriber.complete();
      });
    });
    return obs;
  }
}
