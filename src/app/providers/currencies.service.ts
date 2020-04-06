import { Observable } from 'rxjs';
import { HelperErrorHandlerService } from './helper-error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../models/currency.model';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CurrenciesService extends GenericService<Currency> {

  constructor(protected http: HttpClient,
              protected errorHandlerService: HelperErrorHandlerService) {
                super(http, errorHandlerService, '*/currencies')
              }

  public getCurrencyIdByCode(code: string): Observable<any> {
    let obs = new Observable(suscriber => {
      this.getAll().subscribe((res: Array<any>) => {
        const id = res.find(c => c.Code === code).Id;
        suscriber.next(id);
        suscriber.complete();
      })
    });
    return obs;
  }
    
}
