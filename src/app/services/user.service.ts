import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #apiUrl = environment.apiUrl+'/user';
  #authToken = localStorage.getItem('token');
  apiHeaders: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + this.#authToken
  });

  constructor(private http: HttpClient) { }

  updateUser(userId:string, payload: any){
    return this.http.put(`${this.#apiUrl}/${userId}`,payload, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  getAllUsers(page:number, limit: number) {
    return this.http.get(`${this.#apiUrl}/all?page=${page}&limit=${limit}`,  {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    );
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
