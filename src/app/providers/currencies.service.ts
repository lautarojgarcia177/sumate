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
    
}
