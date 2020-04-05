import { ProductosService } from './../../../providers/productos.service';
import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/providers/categorias.service';

import {Category} from '../../../models/categoria.model';

interface Subcategorias {
  parentCategory: Category;
  subcategorias: Category[];
}

@Component({
  selector: 'app-categorias-consulta',
  templateUrl: './categorias-consulta.component.html',
  styleUrls: ['./categorias-consulta.component.css'],
  providers: [CategoriasService]
})
export class CategoriasConsultaComponent implements OnInit {

  allCategories: Category[] = [];
  parentCategories: Category[] = [];
  parentsWithChilds: Subcategorias[] = [];

  isLoading: boolean = true;

  constructor(private categoriasService: CategoriasService,
              private productosService: ProductosService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadAllCategories();
  }

  loadAllCategories(): void {
    this.categoriasService.getAll().subscribe((res: Array<any>) => {
      res.forEach(element => {
        const c: Category = new Category();
        c.Name = element.Name;
        c.Logo = element.Logo;
        c.Products = element.Products;
        c.Id = element.Id;
        c.ParentId = element.ParentId;
        this.allCategories.push(c);
      });
      this.loadAllParentCategories();
      this.isLoading = false;
    });
  }

  loadAllParentCategories(): void {
    this.allCategories.forEach(c => {
      if (c.ParentId == null) {
        this.parentCategories.push(c);
      }
    });
    this.parentCategories.forEach(pc => {
      let subcats: Category[] = [];
      this.allCategories.forEach(element => {
        if (element.ParentId === pc.Id) {
          subcats.push(element);
        }
      });
      const parentWithChilds: Subcategorias = {
        parentCategory: pc,
        subcategorias: subcats
      }
      this.parentsWithChilds.push(parentWithChilds);
    });
  }

}
