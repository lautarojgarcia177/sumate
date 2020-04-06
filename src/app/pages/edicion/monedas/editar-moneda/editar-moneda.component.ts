import { Currency } from 'src/app/models/currency.model';
import { CurrenciesService } from './../../../../providers/currencies.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import  Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { forbiddenWordsValidation } from 'src/app/shared/custom-validators/forbidden-words-validation';

@Component({
  selector: 'app-editar-moneda',
  templateUrl: './editar-moneda.component.html',
  styleUrls: ['./editar-moneda.component.css'],
  providers:  [CurrenciesService]
})
export class EditarMonedaComponent implements OnInit {

  title: string;
  selectedCurrency;

  error: Error;

  isLoading = true;
  Swal = Swal;

  forma = this.fb.group({
            Code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(6)]],
            Description: ['', [Validators.required, Validators.max(60)], , {'updateOn': blur} ]
          });

  constructor(private fb: FormBuilder,
              public bsModalRef: BsModalRef,
              private currenciesService: CurrenciesService) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.isLoading = false;
  }

  inicializarFormulario(): void {
    if (this.title === 'Editar Moneda') {
      this.forma.reset({
        Code: this.selectedCurrency.Codigo,
        Description: this.selectedCurrency.Descripcion
      });
    }
  }

  onSubmit() {
    this.isLoading = true;
    const reqCurrency: Currency = {
      Code: this.forma.get('Code').value,
      Description: this.forma.get('Description').value
    }
    if (this.title === 'Nueva Moneda') {
      this.currenciesService.add(reqCurrency).subscribe(() => {
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
      this.currenciesService.getCurrencyIdByCode(this.selectedCurrency.Code).subscribe(res => {
        this.currenciesService.edit(res, reqCurrency).subscribe( o => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Se ha editado la moneda',
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
    this.currenciesService.getCurrencyIdByCode(this.selectedCurrency.Codigo)
    .subscribe(id => {
      this.currenciesService.delete(id).subscribe(res => {
        this.isLoading = false;
       Swal.fire({
         icon: 'success',
         title: 'Se ha eliminado la moneda',
         showConfirmButton: false,
         timer: 1500
       });
       this.bsModalRef.hide();
     },
     error => this.error = error); 
   });
  }
}
