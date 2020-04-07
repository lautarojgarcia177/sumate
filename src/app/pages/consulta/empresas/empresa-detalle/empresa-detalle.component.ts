import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EmpresasService } from 'src/app/providers/empresas.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-empresa-detalle',
  templateUrl: './empresa-detalle.component.html',
  styleUrls: ['./empresa-detalle.component.css']
})
export class EmpresaDetalleComponent implements OnInit {

  selectedCompany;

  error: Error;

  isLoading = true;

  constructor(public bsModalRef: BsModalRef,
              private companiesService: EmpresasService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.obtenerLaData();  }

  obtenerLaData() {
      this.companiesService.getAll().subscribe(companies => {
        this.selectedCompany.Descripcion = companies.filter(c => c.Name === this.selectedCompany.Nombre)[0].Description;
        this.isLoading = false;
      });
  }

}
