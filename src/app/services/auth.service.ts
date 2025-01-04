import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError, tap, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #apiUrl = `${environment.apiUrl}/auth`;
  private roleSubject = new BehaviorSubject<string | null>(null); // Emits the role
  public role$: Observable<string | null> = this.roleSubject.asObservable(); // Expose as observable
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  identifyCompany(payload: { company: string }) {
    return this.http.post(`${this.#apiUrl}/identify-company`, payload).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  login(payload: { email: string; password: string }) {
    return this.http.post(`${this.#apiUrl}/login`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.status === 400) {
          errorMessage = 'Email and password are required.';
        } else if (error.status === 404) {
          errorMessage = 'User not found.';
        } else if (error.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (error.status === 500) {
          errorMessage = 'A server error occurred. Please try again later.';
        }
        this.toastr.error(errorMessage, 'Login Failed', {
          timeOut: 3000,
        });
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(payload: { company: string; email: string; name: string; password: string; phone: string }) {
    return this.http.post(`${this.#apiUrl}/register`, payload).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getLoggedInUser() {
    return this.http.get<{ role: string; [key: string]: any }>(`${this.#apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).pipe(
      tap((response) => {
        // Save user data in local storage
        localStorage.setItem('user', JSON.stringify(response));

        // Emit the user's role to the observable
        this.roleSubject.next(response.role);
      }),
      catchError(this.handleError.bind(this))
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
      if (error.status === 401) {
        this.toastr.error(error.message, 'Login', {
          timeOut: 3000
        });
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
