import { Component } from '@angular/core';
import { TileGridComponent } from '@app/components/tile-grid/tile-grid.component';
import { EditingToolService } from '@app/services/editing-tool.service';

@Component({
  selector: 'app-edit-page',
  imports: [TileGridComponent],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
  providers: [EditingToolService]
})
export class EditPageComponent {
}
