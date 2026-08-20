import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  // revisa peticiones a /auth, para no agregar token
  if (req.url.includes('/auth')) {
    return next(req);
  }
  
  // agrega token al header
  const token = localStorage.getItem('token');
  if (!token) {
    // redirige a login
    router.navigate(['/auth/login']);
  }

  // agrega token al header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
