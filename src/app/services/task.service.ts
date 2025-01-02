import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  #apiUrl = environment.apiUrl+'/tasks';
  #authToken = localStorage.getItem('token');
  apiHeaders: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + this.#authToken
  });

  constructor(private http: HttpClient) { }

  createTask(payload: any){
    return this.http.post(`${this.#apiUrl}/create`,payload, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  getAllTasks(page:number, limit: number){
    return this.http.get(`${this.#apiUrl}/all?page=${page}&limit=${limit}`, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  updateTask(taskId: string, payload: any){
    return this.http.put(`${this.#apiUrl}/${taskId}`,payload, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  getTaskById(taskId: string){
    return this.http.get(`${this.#apiUrl}/${taskId}`, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  deleteTask(taskId: string){
    return this.http.delete(`${this.#apiUrl}/${taskId}`, {headers: this.apiHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  addComment(taskId, payload){
    return this.http.post(`${this.#apiUrl}/${taskId}/comment/add`,payload, {headers: this.apiHeaders}).pipe(
      catchError(this.handleError)
    )
  }

  getAllComments(taskId: string){
    return this.http.get(`${this.#apiUrl}/${taskId}/comment/all`, {headers: this.apiHeaders }).pipe(
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
