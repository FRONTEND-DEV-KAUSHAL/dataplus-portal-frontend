import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #apiUrl = environment.apiUrl+'/auth';
  constructor(private http: HttpClient) { }


  identifyCompany(payload: {company: string}){
    return this.http.post(`${this.#apiUrl}/identify-company`, payload).pipe(
      catchError(this.handleError)
    )
  }

  login(payload: {email: string, password: string, companyId: string}){
    return this.http.post(`${this.#apiUrl}/login`, payload).pipe(
      catchError(this.handleError)
    )
  }

  register(payload: { company :string, email: string, name: string, password: string, phone: string }){
    return this.http.post(`${this.#apiUrl}/register`, payload).pipe(
      catchError(this.handleError)
    )
  }

  getLoggedInUser(){
    return this.http.get(this.#apiUrl+'/me', {headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
      }}).pipe(
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
