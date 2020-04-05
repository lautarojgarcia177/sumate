import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  tooltip: string;
  esEdicion: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.tooltip = 'cambiar a modo de edición';
    this.esEdicion = false;
  }

  toggleAction() {
    switch(window.location.pathname.split('/')[1]) {
      case 'consulta':
        this.router.navigate(['/edicion', window.location.pathname.split('/')[2]]);
        this.tooltip = 'cambiar a modo de consulta';
        this.esEdicion = true;
        break;
      case 'edicion':
        this.router.navigate(['/consulta', window.location.pathname.split('/')[2]]);
        this.tooltip = 'cambiar a modo de edición';
        this.esEdicion = false;
        break;
    }
  }

  navigateTo(table: string) {
    this.router.navigate(['/' + window.location.pathname.split('/')[1], table]);

  }


}
