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

  constructor() { }

  ngOnInit(): void {
  }

}
