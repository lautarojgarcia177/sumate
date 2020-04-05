import { environment } from './../environments/environment.prod';
import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
  } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class SumateInterceptor implements HttpInterceptor {

    private url = environment.apiUrl;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const newReq = req.clone({
        url: req.url.replace('*',this.url)
      })
    return next.handle(newReq);
  }


}

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: SumateInterceptor, multi: true }
];