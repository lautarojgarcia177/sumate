import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productos-consulta',
  templateUrl: './productos-consulta.component.html',
  styleUrls: ['./productos-consulta.component.css']
})
export class ProductosConsultaComponent implements OnInit {

  isLoading = false;

  constructor() { }

  ngOnInit(): void {
  }

}
