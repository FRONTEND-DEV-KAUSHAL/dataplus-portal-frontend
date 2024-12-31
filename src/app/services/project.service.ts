import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  #apiUrl = environment.apiUrl+'/project';
  #authToken = localStorage.getItem('token');
  apiHeaders: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + this.#authToken
  });

  constructor(private http: HttpClient) { }

  createProject(payload: any){
    return this.http.post(`${this.#apiUrl}/create`,payload, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  getAllProjects(page:number, limit: number){
    return this.http.get(`${this.#apiUrl}/all?page=${page}&limit=${limit}`, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  updateProjects(taskId: string, payload: any){
    return this.http.put(`${this.#apiUrl}/${taskId}`,payload, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  getProjectById(taskId: string){
    return this.http.get(`${this.#apiUrl}/${taskId}`, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  deleteProject(taskId: string){
    return this.http.delete(`${this.#apiUrl}/${taskId}`, {headers: this.apiHeaders}).pipe(
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
