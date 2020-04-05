import { HelperErrorHandlerService } from './helper-error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService extends GenericService<Company> {

  constructor(protected http: HttpClient,
              protected errorHandlerService: HelperErrorHandlerService) {
                super(http, errorHandlerService, '*/companies')
               }
}
