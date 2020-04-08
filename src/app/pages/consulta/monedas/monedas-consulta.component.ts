import { CurrenciesService } from './../../../providers/currencies.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import { Currency } from 'src/app/models/currency.model';

@Component({
  selector: 'app-monedas-consulta',
  templateUrl: './monedas-consulta.component.html',
  styleUrls: ['./monedas-consulta.component.css'],
  providers: [
    CurrenciesService
  ]
})
export class MonedasConsultaComponent implements OnInit {

  isLoading = true;
  allcurrencies;

  limit = 10;
  rows = [];
  temp = [];
  filterquery = new FormControl('');
  columns = [
    {prop: 'Codigo'},
    {prop: 'Descripcion'}
  ];
  ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  limitControl: FormControl;

  constructor(private currenciesService: CurrenciesService) { }

  ngOnInit(): void {
    this.obtenerLaData();
  }

  obtenerLaData(): void {

    this.currenciesService.getAll().subscribe(res => {
      this.allcurrencies = res;
      this.transformarMonedas(res);
      if (this.limit > res.length) {
        this.limit = res.length;
      }
      this.limitControl = new FormControl(this.limit, Validators.max(this.limit));
      this.isLoading = false;
    })
  }

  onLimitChange(): void {
    if(this.limitControl.value > this.allcurrencies.length) {
      this.limitControl.setValue(this.allcurrencies.length);
    }
    if(this.limitControl.value < 0) {
      this.limitControl.setValue(0);
    }
 }

  transformarMonedas(res): void {
    let aux: Currency[] = res;
    this.rows = aux.map(curr => {
      return {
        Codigo: curr.Code,
        Descripcion: curr.Description
      }
    });
    this.temp = this.rows;
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
      return d.Descripcion.toLowerCase().indexOf(val) !== -1 || !val;
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

  columnClass() {
    return 'datatable-column'
  }
}
