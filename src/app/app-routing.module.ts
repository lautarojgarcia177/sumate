import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'edicion', loadChildren: () => import('./pages/edicion/edicion.module').then(m => m.EdicionModule)},
  {path: 'consulta', loadChildren: () => import('./pages/consulta/consulta.module').then(n => n.ConsultaModule) },
  {path: '**', redirectTo: '/consulta/categorias'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
