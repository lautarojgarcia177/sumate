import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriasConsultaComponent } from './categorias/categorias-consulta.component';
import { EmpresasConsultaComponent } from './empresas/empresas-consulta.component';
import { MonedasConsultaComponent } from './monedas/monedas-consulta.component';
import { ProductosConsultaComponent } from './productos/productos-consulta.component';

const routes: Routes = [
  { path: 'categorias', component: CategoriasConsultaComponent },
  { path: 'empresas', component: EmpresasConsultaComponent },
  { path: 'monedas', component: MonedasConsultaComponent },
  { path: 'productos', component: ProductosConsultaComponent },
  { path: '', component: CategoriasConsultaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaRoutingModule { }
