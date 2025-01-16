import { Component } from '@angular/core';
import { TileGridComponent } from '@app/components/tile-grid/tile-grid.component';
import { EditingToolService } from '@app/services/editing-tool.service';
import { BrushGridComponent } from "../../components/brush-grid/brush-grid.component";

@Component({
  selector: 'app-edit-page',
  imports: [TileGridComponent, BrushGridComponent],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
  providers: [EditingToolService]
})
export class EditPageComponent {
}
