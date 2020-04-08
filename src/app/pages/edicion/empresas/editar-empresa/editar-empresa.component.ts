import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EmpresasService } from 'src/app/providers/empresas.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import  Swal from 'sweetalert2';
import { Company } from 'src/app/models/company.model';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { imgValidation } from 'src/app/shared/custom-validators/img-validation';
import {forbiddenNameValidator} from 'src/app/shared/custom-validators/forbidden-name';
import { httpsValidation } from 'src/app/shared/custom-validators/url-validation';

@Component({
  selector: 'app-editar-empresa',
  templateUrl: './editar-empresa.component.html',
  styleUrls: ['./editar-empresa.component.css'],
  providers: [EmpresasService]
})
export class EditarEmpresaComponent implements OnInit {
  
  selectedCompany;
  datepickerInitialValue: Date;

  error: Error;

  isLoading = true;
  
  title: string;

  Swal = Swal;

  nullimg: string = '/assets/img/no-img-placeholder.png';

  forma: FormGroup = this.fb.group({
    Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    FoundationDate: [''],
    Address: [''],
    City: [''],
    Website: [''],
    Email: ['', [Validators.email]],
    Description: ['', [Validators.maxLength(200)]],
    Phone: [''],
    Logo: ['', [imgValidation]]
  });

  maxDate: Date;

  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;

  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker.hide();
  }

  constructor(public bsModalRef: BsModalRef,
              private companiesService: EmpresasService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.obtenerLaData(); 
   }

  obtenerLaData() {
    if(this.selectedCompany) {
      this.companiesService.getAll().subscribe(companies => {
        this.selectedCompany = companies.filter(c => c.Name === this.selectedCompany.Nombre)[0];
        if (this.selectedCompany.Logo === null ) {
          this.selectedCompany.Logo = this.nullimg;
        }
        if (this.selectedCompany.FoundationDate) {
          this.datepickerInitialValue = this.formatearFecha();
        }
        this.inicializarFormulario();
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }      
  }

  formatearFecha(): Date {
      let date = new Date();
      const dia = parseInt(this.selectedCompany.FoundationDate.substr(8,2));
      const mes = parseInt(this.selectedCompany.FoundationDate.substr(5,2));
      const anio = parseInt(this.selectedCompany.FoundationDate.substr(0,4));
      date.setDate(dia);
      date.setMonth(mes);
      date.setFullYear(anio);
      return date;
  }

  inicializarFormulario(): void {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
    if (this.title === 'Editar Empresa') {
      this.forma.reset({
        Name: this.selectedCompany.Name,
        FoundationDate: this.datepickerInitialValue,
        Address: this.selectedCompany.Address,
        City: this.selectedCompany.City,
        Website: this.selectedCompany.Website,
        Email: this.selectedCompany.Email,
        Description: this.selectedCompany.Description,
        Phone: this.selectedCompany.Phone,
        Logo: this.selectedCompany.Logo
      });
    }
    console.log(this.forma.controls);
  }

  esCodigoYaTomado(): void {
    if (this.title === 'Nueva Empresa' ) {
      this.companiesService.isNameTaken(this.forma.get('Name').value).subscribe(isTaken => {
        if (isTaken) {
          this.forma.get('Name').setErrors({notUnique: true});
        }
      });
    } else {
      if (this.selectedCompany.Nombre !== this.forma.get('Name').value) {
        this.companiesService.isNameTaken(this.forma.get('Name').value).subscribe(isTaken => {
          if (isTaken) {
            this.forma.get('Name').setErrors({notUnique: true});
          }
        });
      }
    }
  }

  onSubmit() {
    this.isLoading = true;
    const reqCurrency: Company = {
      Name: this.forma.get('Name').value,
      FoundationDate: this.forma.get('FoundationDate').value,
      Address: this.forma.get('Address').value,
      City: this.forma.get('City').value,
      Website: this.forma.get('Website').value,
      Email: this.forma.get('Email').value,
      Description: this.forma.get('Description').value,
      Phone: this.forma.get('Phone').value,
      Logo: this.forma.get('Logo').value
    }
    if (this.title === 'Nueva Empresa') {
      this.companiesService.add(reqCurrency).subscribe(() => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Se ha registrado la nueva categoría',
          showConfirmButton: false,
          timer: 1500
        })
        this.bsModalRef.hide();
      },
      error => this.error = error);
    } else {
      this.companiesService.getCompanyIdByName(this.selectedCompany.Name).subscribe(res => {
        this.companiesService.edit(res, reqCurrency).subscribe( o => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Se ha editado la empresa',
            showConfirmButton: false,
            timer: 1500
          });
          this.bsModalRef.hide();
        },
        error => this.error = error);
      }); 
    }
  
  }

  eliminar() {
    this.isLoading = true;
    this.companiesService.getCompanyIdByName(this.selectedCompany.Name)
    .subscribe(id => {
      this.companiesService.delete(id).subscribe(res => {
        this.isLoading = false;
       Swal.fire({
         icon: 'success',
         title: 'Se ha eliminado la empresa',
         showConfirmButton: false,
         timer: 1500
       });
       this.bsModalRef.hide();
     },
     error => this.error = error); 
   });
  }

}