import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subcard',
  templateUrl: './subcard.component.html',
  styleUrls: ['./subcard.component.css']
})
export class SubcardComponent implements OnInit {

  @Input() img: string;
  @Input() title: string;
  @Input() text: string;
  _img: string;

  constructor() { }

  ngOnInit(): void {
    if(!this.img ) {
      this._img = 'assets/img/no-img-placeholder.png';
    } else {
      this._img = this.img;
    }
  }

}
