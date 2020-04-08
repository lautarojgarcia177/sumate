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

  constructor() { }

  ngOnInit(): void {
    this.itemsRight = this.allcategories;
  }

  get selectedCategories(): number[] {
    return this.itemsLeft.map(item => item["Id"]);
  }

  public hola():void {
    console.log('been here');
  }

  setSelectedCategories(categories: number[]) {
    categories.forEach(cId => {
      this.itemsLeft.push(this.allcategories.find(cat => cat.Id === cId));
      const indexARemover = this.itemsRight.indexOf(this.itemsRight.find(item => item.Id === cId));
      this.itemsRight.splice(indexARemover, 1);
    });    
  }

}
