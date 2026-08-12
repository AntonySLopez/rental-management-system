import { Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

@Service()
export class AuthRepository {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // conexion con el backend
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request);
  }
}
