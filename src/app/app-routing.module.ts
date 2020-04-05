import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CategoriasEdicionComponent} from './pages/edicion/categorias/categorias-edicion.component';
import {CategoriasConsultaComponent} from './pages/consulta/categorias/categorias-consulta.component';
import {MonedasConsultaComponent} from './pages/consulta/monedas/monedas-consulta.component';

const routes: Routes = [
  //{path: 'edicion', loadChildren: () => import('./pages/edicion/edicion.module').then(m => m.EdicionModule)},
  //{path: 'consulta', loadChildren: () => import('./pages/consulta/consulta.module').then(n => n.ConsultaModule) },
  //{path: '**', redirectTo: '/consulta/categorias'}
  {path: 'categoriasEdicion', component: CategoriasEdicionComponent},
  {path: 'categorias', component: CategoriasConsultaComponent},
  {path: '**', component: MonedasConsultaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
