import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriasEdicionComponent } from './categorias/categorias-edicion.component';
import { EmpresasEdicionComponent } from './empresas/empresas-edicion.component';
import { MonedasEdicionComponent } from './monedas/monedas-edicion.component';
import { ProductosEdicionComponent } from './productos/productos-edicion.component';
import { EditarCategoriaComponent } from './categorias/editar-categoria/editar-categoria.component';

const routes: Routes = [
  { path: 'categorias', component: CategoriasEdicionComponent },
  { path: 'empresas', component: EmpresasEdicionComponent },
  { path: 'monedas', component: MonedasEdicionComponent },
  { path: 'productos', component: ProductosEdicionComponent },
  { path: '', component: CategoriasEdicionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EdicionRoutingModule { }
