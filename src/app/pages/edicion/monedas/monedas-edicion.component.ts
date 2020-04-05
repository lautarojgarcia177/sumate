/* import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from '../../../providers/currencies.service';
import { Currency } from '../../../models/currency.model';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

interface CurrencyState {
  currency: Currency,
  isEditing: boolean;
}

@Component({
  selector: 'app-monedas',
  templateUrl: './monedas-edicion.component.html',
  styleUrls: ['./monedas-edicion.component.css'],
  providers: [CurrenciesService]
})
export class MonedasEdicionComponent implements OnInit {

  isLoading = true;
  allCurrencies: Currency[] = [];
  currenciesStates: CurrencyState[] = [];

  estaEditando = false;

  currenciesForm = this.fb.group({
    Code: ['', [Validators.required]],
    Description: ['', [Validators.required]]
  });

  constructor(private currenciesService: CurrenciesService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.currenciesService.getAll().subscribe(res => {
      //this.setCurrencies(res);
      this.isLoading = false;
    });
  }

  setCurrencies(currs: Currency[]): void {
    this.allCurrencies = currs;
    this.allCurrencies.forEach(curr => {
      const currencyState: CurrencyState = {
        currency: curr,
        isEditing: false
      }
      this.currenciesStates.push(currencyState);
    });
  }

  editarCurrency(index) {
    this.currenciesStates[index].isEditing = true;
    this.estaEditando = true;
    this.currenciesForm.reset({
      Code: this.currenciesStates[index].currency.Code,
      Description: this.currenciesStates[index].currency.Description
    });
  }

  guardar(index) {
    this.currenciesStates[index].isEditing = false;
    this.estaEditando = false;
  }

  cancelar(index) {
    this.currenciesStates[index].isEditing = false;
    this.estaEditando = false;
  }

  onSubmit() {
    this.estaEditando = false;
    this.currenciesStates.find(currs => currs.isEditing === true).currency.Code = this.currenciesForm.value.Code;
    this.currenciesStates.find(currs => currs.isEditing === true).currency.Description = this.currenciesForm.value.Description;
    this.currenciesStates.find(currs => currs.isEditing === true).isEditing = false;
    // hacer el http put
  }


}
 */