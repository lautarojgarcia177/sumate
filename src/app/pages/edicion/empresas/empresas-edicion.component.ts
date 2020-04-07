import { Company } from './../../../models/company.model';
import { EmpresasService } from './../../../providers/empresas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { DatatableComponent} from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditarEmpresaComponent } from './editar-empresa/editar-empresa.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-empresas-edicion',
  templateUrl: './empresas-edicion.component.html',
  styleUrls: ['./empresas-edicion.component.css'],
  providers: [
    EmpresasService
  ]
})
export class EmpresasEdicionComponent implements OnInit {

  isLoading = true;

  limit = 10;
  rows = [];
  temp = [];
  filterquery = new FormControl('');
  selected = [];
  columns = [
    {prop: 'Nombre'},
    //{prop: 'Descripcion'},
    {prop: 'Website'},
    {prop: 'Logo'},
    {prop: 'Email'},
    {prop: 'Ciudad'},
    {prop: 'Direccion'},
    {prop: 'Telefono'},
    {prop: 'Fundacion'}
  ];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  allCompanies;

  limitControl: FormControl;

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  constructor(private empresasService: EmpresasService,
              private bsModalService: BsModalService) { }

  ngOnInit(): void {
    this.obtenerLaData();
  }

  obtenerLaData(): void {
    this.empresasService.getAll().subscribe(res => {
      this.allCompanies = res;
      this.transformarEmpresas(res);
      if (this.limit > res.length) {
        this.limit = res.length;
      }
      this.limitControl = new FormControl(this.limit, Validators.max(this.limit));
      this.isLoading = false;
    });
  }

   transformarEmpresas(res): void {
    let aux: Company[] = res;
    this.rows = aux.map(curr => {
        return {
          Nombre: curr.Name,
          //Descripcion: curr.Description,
          Website: this.formatearWebsite(curr.Website),
          Logo: this.formatearLogo(curr.Logo),
          Email: this.formatearEmail(curr.Email),
          Ciudad: curr.City,
          Direccion: curr.Address,
          Telefono: curr.Phone,
          Fundacion: this.formatearFundacion(curr.FoundationDate)
        }
    });
    this.temp = this.rows;
  } 

  formatearLogo(logo: string): string {
    if (logo) {
      logo = '<img class="category-logo rounded-lg" src="' + logo + '">';
    } else {
      logo = '<img class="category-logo rounded-lg" src="/assets/img/no-img-placeholder.png">';
    }
    return logo;
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

  verDetalleEmpresa(event) {
    console.log(event.selected[0]);
    const config = {
      keyboard: true,
      initialState: {
        selectedCompany: event.selected[0]
      }
    }
    this.modalRef = this.bsModalService.show(EditarEmpresaComponent, config);

  }

  onLimitChange(): void {
    if(this.limitControl.value > this.limit) {
      this.limitControl.setValue(this.limit);
    }
    if(this.limitControl.value < 0) {
      this.limitControl.setValue(0);
    }
 }

 nuevaEmpresa() {
  const config = {
    keyboard: true,
    initialState: {
      title: 'Nueva Empresa'
    }
  }
  this.modalRef = this.bsModalService.show(EditarEmpresaComponent, config);
  this.subscriptions.push(
    this.bsModalService.onHide.subscribe((reason: string) => {
      if (reason !== 'backdrop-click') {
        this.refreshTable();
      }
    })
  );
}

editarEmpresa(event) {
    const config = {
      keyboard: true,
      initialState: {
        title: 'Editar Empresa',
        selectedCompany: event.selected[0],
      }
    };
    this.modalRef = this.bsModalService.show(EditarEmpresaComponent, config);

    this.subscriptions.push(
      this.bsModalService.onHide.subscribe(() => {
        this.refreshTable()
      })
    );
}

  hoverRed(row) {
    return 'hoverRow';
  }
  
}
