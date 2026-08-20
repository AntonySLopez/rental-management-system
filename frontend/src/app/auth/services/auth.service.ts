import { Service, inject } from '@angular/core';
import { AuthRepository } from '../repository/auth.repository';
import { LoginRequest } from '../models/auth.model';

@Service()
export class AuthService {
  private authRepository = inject(AuthRepository);
  
  login(request: LoginRequest) {
    const result = this.authRepository.login(request);
    // guarda el token en el localStorage
    result.subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
      }
    });
    return result;
  }
}