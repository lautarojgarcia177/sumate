import { Observable } from 'rxjs';
import { retry, catchError} from 'rxjs/operators';
import { HelperErrorHandlerService } from './helper-error-handler.service';
import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export abstract class GenericService<T> {

  protected error: Error;
  protected _url: string

  protected allItems: Array<T> = [];

  constructor(protected http: HttpClient,
              protected errorHandlerService: HelperErrorHandlerService,
              @Inject(String) protected url: string) {
                  this._url = url;
               }

  public getAll(force?: any): Observable<Array<T>> {
    let obs = new Observable<Array<T>>((suscriber) => {
      if (this.allItems.length === 0 || force) {  
        this._getAll().subscribe((res: Array<T>) => {
          this.allItems = res;
          suscriber.next(this.allItems);
          suscriber.complete();
        });
      } else {
        suscriber.next(this.allItems);
        suscriber.complete();
      }
    });
    return obs;
  }      

  protected _getAll<T>(): Observable<T> {
    return this.http.get<any>(this._url)
      .pipe(
        retry(2),
        catchError(this.errorHandlerService.handleError)
      );
  }

  public add(toadd: T): Observable<T> {
    let obs = new Observable<T>(suscriber => {
      this._add(toadd).subscribe((res: T) => {
        this.getAll('force').subscribe(() => {
          suscriber.next(res);
          suscriber.complete();
        });
      });
    });
    return obs;
  }

  protected _add<T>(toadd: T): Observable<T> {
    return this.http.post<T>(this._url, toadd)
      .pipe(
        retry(2),
        catchError(this.errorHandlerService.handleError)
      );
   }

   public delete(todeleteid: number | string): Observable<T> {
     let obs = new Observable<T>(suscriber => {
      this._delete(todeleteid).subscribe((res: T) => {
        this.getAll('force').subscribe(() => {
          suscriber.next(res);
          suscriber.complete();
        });
      });
     });
     return obs;
   }
   
   protected _delete<T>(todeleteid: number | string): Observable<T> {
    return this.http.delete<T>(this._url + '/' + todeleteid)
    .pipe(
      retry(2),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public edit<T>(toeditid: number | string, toedit: T): Observable<T> {
    let obs = new Observable<T>(suscriber => {
      this._edit(toeditid, toedit).subscribe((res: T) => {
        this.getAll('force').subscribe(() => {
          suscriber.next(res);
          suscriber.complete();
        });
      });
     });
     return obs;
  }

  protected _edit<T>(toeditid: number | string, toedit: T): Observable<T> {
    return this.http.put<T>(this._url + '/' + toeditid, toedit)
    .pipe(
      retry(2),
      catchError(this.errorHandlerService.handleError)
    );
 };

}
