import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-animated-text',
  templateUrl: './animated-text.component.html',
  styleUrls: ['./animated-text.component.css']
})
export class AnimatedTextComponent implements OnInit {

  @Input() text: string;
  @Input() delay: number = 150;

  _text: string[];
  hidden = true;

  constructor() { }

  ngOnInit(): void {
    this._text = this.text.split('');
    this.animar(this.delay);
  }

  animar(delay: number) {
    setTimeout(() => this.hidden = false, delay);
  }

}
