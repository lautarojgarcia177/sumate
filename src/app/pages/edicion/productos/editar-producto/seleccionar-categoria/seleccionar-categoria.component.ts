import { Component, OnInit, Input } from '@angular/core';
import { Category } from 'src/app/models/categoria.model';
import { CategoriasService } from 'src/app/providers/categorias.service';

@Component({
  selector: 'app-seleccionar-categoria',
  templateUrl: './seleccionar-categoria.component.html',
  styleUrls: ['./seleccionar-categoria.component.css']
})
export class SeleccionarCategoriaComponent implements OnInit {

  title: string;

  @Input() allcategories: Category[];

  itemsLeft: Category[] = [];
  itemsRight: Category[] = [];

  itemStringsLeft = [
  ]; 
  itemStringsRight = [
    'Windstorm',
    'Bombasto',
    'Magneta',
    'Tornado',
    'Mr. O',
    'Tomato'
  ];

  constructor() { }

  ngOnInit(): void {
    this.itemsRight = this.allcategories;
  }

  get selectedCategories(): number[] {
    return this.itemsLeft.map(item => item["Id"]);
  }

}
