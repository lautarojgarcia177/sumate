import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrenciesService } from '../../../providers/currencies.service';
import { Currency } from '../../../models/currency.model';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import { EditarMonedaComponent } from './editar-moneda/editar-moneda.component';

@Component({
  selector: 'app-monedas',
  templateUrl: './monedas-edicion.component.html',
  styleUrls: ['./monedas-edicion.component.css'],
  providers: [CurrenciesService]
})
export class MonedasEdicionComponent implements OnInit {

  allCurrencies;
  isLoading = true;

  limit = 10;
  rows = [];
  temp = [];
  selected = [];
  filterquery = new FormControl('');
  columns = [
    {prop: 'Codigo'},
    {prop: 'Descripcion'}
  ];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  limitControl: FormControl;

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  constructor(private currenciesService: CurrenciesService,
              private bsModalService: BsModalService) { }

  ngOnInit(): void {
    this.obtenerLaData();
  }

  obtenerLaData(): void {

    this.currenciesService.getAll().subscribe(res => {
      this.allCurrencies = res;
      this.transformarMonedas(res);
      if (this.limit > res.length) {
        this.limit = res.length;
      }
      this.limitControl = new FormControl(this.limit, Validators.max(this.limit));
      this.isLoading = false;
    })
  }

  onLimitChange(): void {
     if(this.limitControl.value > this.allCurrencies.length) {
       this.limitControl.setValue(this.allCurrencies.length);
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

  nuevaMoneda() {
    const config = {
      keyboard: true,
      initialState: {
        title: 'Nueva Moneda'
      }
    }
    this.modalRef = this.bsModalService.show(EditarMonedaComponent, config);
    this.subscriptions.push(
      this.bsModalService.onHide.subscribe((reason: string) => {
        if (reason !== 'backdrop-click') {
          this.refreshTable();
        }
      })
    );
  }

  onSelect({selected}) {
    console.log('Select Event', selected, this.selected);
  }

  editarMoneda(event) {
    const config = {
      keyboard: true,
      initialState: {
        title: 'Editar Moneda',
        selectedCurrency: event.selected[0]
      }
    }
    this.modalRef = this.bsModalService.show(EditarMonedaComponent, config);

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
