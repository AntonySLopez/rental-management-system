import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'inquilinos',
        loadComponent: () => import('./inquilinos/registrar-inquilinos/registrar-inquilinos.component').then(m => m.RegistrarInquilinosComponent)
    },
    {
        path: 'locales',
        loadComponent: () => import('./locales/registrar-local/registrar-local.component').then(m => m.RegistrarLocalComponent)
    },
    {
        path: 'propiedades',
        loadComponent: () => import('./propiedades/registrar-propiedades/registrar-propiedades.component').then(m => m.RegistrarPropiedadesComponent)
    },
    {
        path: 'contratos',
        loadComponent: () => import('./contratos/registrar-contrato/registrar-contrato').then(m => m.RegistrarContrato)
    },
    {
        path: 'pagos',
        loadComponent: () => import('./pagos/registrar-pagos/registrar-pagos').then(m => m.RegistrarPagos)
    },
    {
        path: 'deudas',
        loadComponent: () => import('./deudas/registrar-deuda/registrar-deuda.component').then(m => m.RegistrarDeudaComponent)
    },
    {
        path: 'luz',
        loadComponent: () => import('./luz/registrar-consumo/registrar-consumo.component').then(m => m.RegistrarConsumoComponent)
    }
];
