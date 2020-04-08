import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { QuillModule } from 'ngx-quill';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';

import { CardComponent } from './components/ui/card/card.component';
import { SubcardComponent } from './components/ui/card/subcard/subcard.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

import {httpInterceptorProviders} from './http-interceptor';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/ui/navbar/navbar.component';
import { BreadcrumbComponent } from './components/ui/breadcrumb/breadcrumb.component';

import { CategoriasConsultaComponent } from 'src/app/pages/consulta/categorias/categorias-consulta.component';
import { ProductosConsultaComponent } from 'src/app/pages/consulta/productos/productos-consulta.component';
import { MonedasConsultaComponent } from 'src/app/pages/consulta/monedas/monedas-consulta.component';
import { EmpresasConsultaComponent } from 'src/app/pages/consulta/empresas/empresas-consulta.component';
import { CategoriasEdicionComponent } from 'src/app/pages/edicion/categorias/categorias-edicion.component';
import { EmpresasEdicionComponent } from 'src/app/pages/edicion/empresas/empresas-edicion.component';
import { MonedasEdicionComponent } from 'src/app/pages/edicion/monedas/monedas-edicion.component';
import { ProductosEdicionComponent } from 'src/app/pages/edicion/productos/productos-edicion.component';
import { AnimatedTextComponent } from './components/animated-text/animated-text.component';
import { EditarCategoriaComponent } from 'src/app/pages/edicion/categorias/editar-categoria/editar-categoria.component';
import { AnimatedCheckboxComponent } from './components/animated-checkbox/animated-checkbox.component';
import { EditarMonedaComponent } from './pages/edicion/monedas/editar-moneda/editar-moneda.component';
import {EmpresaDetalleComponent} from 'src/app/pages/consulta/empresas/empresa-detalle/empresa-detalle.component';
import { EditarEmpresaComponent } from 'src/app/pages/edicion/empresas/editar-empresa/editar-empresa.component';
import { ProductosDetalleComponent } from './pages/consulta/productos/productos-detalle/productos-detalle.component';
import { EditarProductoComponent } from './pages/edicion/productos/editar-producto/editar-producto.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BreadcrumbComponent,
    CardComponent,
    SubcardComponent,
    LoadingSpinnerComponent,
    CategoriasConsultaComponent,
    ProductosConsultaComponent,
    MonedasConsultaComponent,
    EmpresasConsultaComponent,
    CategoriasEdicionComponent,
    ProductosEdicionComponent,
    EmpresasEdicionComponent,
    MonedasEdicionComponent,
    AnimatedTextComponent,
    EditarCategoriaComponent,
    AnimatedCheckboxComponent,
    EditarMonedaComponent,
    EmpresaDetalleComponent,
    EditarEmpresaComponent,
    ProductosDetalleComponent,
    EditarProductoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    NgxDatatableModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    QuillModule.forRoot({
      theme: 'snow'
    }),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
