import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-info',
  imports: [],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss',
  standalone: true
})
export class GameInfoComponent {
  @Input() name : string;
  @Input() size : number;
  @Input() mode : string;
  @Input() lastModified : Date;
}
