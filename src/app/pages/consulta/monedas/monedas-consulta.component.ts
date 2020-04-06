import { CurrenciesService } from './../../../providers/currencies.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  constructor(private currenciesService: CurrenciesService) { }

  ngOnInit(): void {
    this.obtenerLaData();
  }

  obtenerLaData(): void {

    this.currenciesService.getAll().subscribe(res => {
      this.transformarMonedas(res);
      this.isLoading = false;
    })
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
