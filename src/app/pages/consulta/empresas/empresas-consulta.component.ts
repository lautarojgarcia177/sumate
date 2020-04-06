import { Company } from './../../../models/company.model';
import { EmpresasService } from './../../../providers/empresas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import {DatatableComponent} from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-empresas-consulta',
  templateUrl: './empresas-consulta.component.html',
  styleUrls: ['./empresas-consulta.component.css'],
  providers: [
    EmpresasService
  ]
})
export class EmpresasConsultaComponent implements OnInit {

  isLoading = true;

  limit = 10;
  rows = [];
  temp = [];
  filterquery = new FormControl('');
  columns = [
    {prop: 'Nombre'},
    {prop: 'Descripcion'},
    {prop: 'Website'},
    {prop: 'Logo'},
    {prop: 'Email'},
    {prop: 'Ciudad'},
    {prop: 'Direccion'},
    {prop: 'Telefono'},
    {prop: 'Fundacion'}
  ];
  ColumnMode = ColumnMode;
  allCompanies;

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(private empresasService: EmpresasService) { }

  ngOnInit(): void {
    this.obtenerLaData();
  }

  obtenerLaData(): void {
    this.empresasService.getAll().subscribe(res => {
      this.allCompanies = res;
      this.transformarEmpresas(res);
      this.isLoading = false;
    });
  }

   transformarEmpresas(res): void {
    let aux: Company[] = res;
    this.rows = aux.map(curr => {
        return {
          Nombre: curr.Name,
          Descripcion: curr.Description,
          Website: this.formatearWebsite(curr.Website),
          Logo: curr.Logo,
          Email: this.formatearEmail(curr.Email),
          Ciudad: curr.City,
          Direccion: this.formatearDireccion(curr.Address),
          Telefono: curr.Phone,
          Fundacion: this.formatearFundacion(curr.FoundationDate)
        }
    });
    this.temp = this.rows;
  } 

  formatearDireccion(direccion: string): string {
    if(direccion) {
      const url = 'https://goo.gl/maps/VEgrv5MgNL9RUxJL6';
      return `<a href="${url}" target="_blank" >${direccion}</a>`;
    } else {
      return '';
    }
  }

  formatearWebsite(website: string): string {
    if (website) { 
      if (website.startsWith('https://')) {
        const inicio = ' <a href="';
        const mid = '" target="_blank" >';
        const fin = '</a>';
        return inicio + website + mid + website + fin ;
      } else {
        const inicio = ' <a href="https://';
        const mid = '" target="_blank" >';
        const fin = '</a>';
        return inicio + website + mid + website + fin ;
      }
    } else {
      return '';
    }
  }

  formatearEmail(email: string): string {
    if (email) {
      const inicio = ' <a href="mailto:';
      const mid = '">';
      const fin = '</a>';
      return inicio + email + mid + email + fin ;  
    } else {
      return '';
    }
  }

  formatearFundacion(fundacion: any): string {
    if(fundacion) {
      const dia = fundacion.substr(8,2);
      const mes = fundacion.substr(5,2);
      const year = fundacion.substr(0,4);
      let fecha = `${dia}/${mes}/${year}`;
      return fecha;
    } else {
      return '';
    }
  }

  updateFilter(event?) {
    let val;
    if(event) {
       val = event.target.value.toLowerCase();
    } else {
      val = '';
    }

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.Nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  clearFilter() {
    this.filterquery.reset();
    this.updateFilter()
  }

  refreshTable() {
    this.rows = [...this.rows];
    window.location.reload();
  }
}
