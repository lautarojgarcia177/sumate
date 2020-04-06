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

  safeHtml;

  constructor(public bsModalRef: BsModalRef,
              private companiesService: EmpresasService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.obtenerLaData();
    const mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3406.4317888642763!2d-64.23468008431362!3d-31.374655601375142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432992f312a6c6d%3A0x222ee389c5e2becf!2sAv.%20Fernando%20Fader%203971%2C%20C%C3%B3rdoba!5e0!3m2!1sen!2sar!4v1586185143340!5m2!1sen!2sar';
    console.log('safe url', this.sanitizer.bypassSecurityTrustUrl(mapUrl));
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
      '<iframe id="Map" style="border-style: solid; border-radius: 10px; border-color: rgb(218, 218, 218); border-width: 1px; width: 100%; height: 400px;" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3406.4317888642763!2d-64.23468008431362!3d-31.374655601375142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432992f312a6c6d%3A0x222ee389c5e2becf!2sAv.%20Fernando%20Fader%203971%2C%20C%C3%B3rdoba!5e0!3m2!1sen!2sar!4v1586185143340!5m2!1sen!2sar" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>'
    );
  }

  obtenerLaData() {
      this.companiesService.getAll().subscribe(companies => {
        this.selectedCompany.Descripcion = companies.filter(c => c.Name === this.selectedCompany.Nombre)[0].Description;
        this.isLoading = false;
      });
  }

}
