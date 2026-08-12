import { Service, inject } from '@angular/core';
import { AuthRepository } from '../repository/auth.repository';
import { LoginRequest } from '../models/auth.model';

@Service()
export class AuthService {
  private authRepository = inject(AuthRepository);
  
  login(request: LoginRequest) {
    return this.authRepository.login(request);
  }
}