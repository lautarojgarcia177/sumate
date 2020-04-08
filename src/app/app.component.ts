import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'sumate';

  constructor() {
    setTheme('bs4');
  }
}
