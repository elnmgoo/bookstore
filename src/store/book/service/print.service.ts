import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class PrintService {
  printUrl = environment.apiUrl + '/printer';

  constructor(private httpClient: HttpClient) {
  }

  initPrinter(): Observable<boolean> {
    return this.httpClient.post<boolean>(this.printUrl + '/init', null);
  }

  printLogoAndAddress(): Observable<boolean> {
    return this.httpClient.post<boolean>(this.printUrl + '/printLogoAndAddress', null);
  }

  printSolidLine(): Observable<boolean> {
    return this.httpClient.post<boolean>(this.printUrl + '/printSolidLine', null);
  }

  printStringNewLine(text: string, bold: boolean, center: boolean): Observable<boolean> {
    let params = new HttpParams();
    params = params.append('bold', bold.toString());
    params = params.append('center', center.toString());
    return this.httpClient.post<boolean>(this.printUrl + '/printStringNewLine', text, {params});
  }

  printToPrinter(): Observable<boolean> {
    return this.httpClient.post<boolean>(this.printUrl + '/printToPrinter', null);
  }
}
