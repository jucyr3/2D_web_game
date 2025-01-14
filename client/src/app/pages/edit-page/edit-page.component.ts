import { Component } from '@angular/core';
import { TileGridComponent } from '@app/components/tile-grid/tile-grid.component';

@Component({
  selector: 'app-edit-page',
  imports: [TileGridComponent],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss'
})
export class EditPageComponent {
}
