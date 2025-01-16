import { Component } from '@angular/core';
import { DiceComponent } from '../dice/dice.component';
import { NameComponent } from '../name/name.component';
import { StatComponent } from '../stat/stat.component';

@Component({
  selector: 'app-profile-showcase',
  imports: [DiceComponent,NameComponent,StatComponent],
  templateUrl: './profile-showcase.component.html',
  styleUrl: './profile-showcase.component.scss'
})
export class ProfileShowcaseComponent {

}
