import { HelperErrorHandlerService } from './helper-error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Company } from '../models/company.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService extends GenericService<Company> {

  constructor(protected http: HttpClient,
              protected errorHandlerService: HelperErrorHandlerService) {
                super(http, errorHandlerService, '*/companies')
               }

  public isNameTaken(code: string): Observable<boolean> {
    const obs = new Observable<boolean>(suscriber => {
      this.getAll().subscribe(res => {
        const newArr = res.map(c => c.Name);
        if (newArr.includes(code)) {
          suscriber.next(true);
        } else {
          suscriber.next(false);
        }
        suscriber.complete();
      });
    });
    return obs;
  }
}
