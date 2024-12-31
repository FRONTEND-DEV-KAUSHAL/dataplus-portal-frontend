import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  #apiUrl = environment.apiUrl+'/dashboard';
  #authToken = localStorage.getItem('token');
  apiHeaders: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + this.#authToken
  });

  constructor(private http: HttpClient) { }

  getDashboardData(){
    return this.http.get(`${this.#apiUrl}/getDashboardData`, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
