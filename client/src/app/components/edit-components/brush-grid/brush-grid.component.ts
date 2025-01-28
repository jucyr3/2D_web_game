import { Component } from '@angular/core';
import { EditingToolService } from '@app/services/editing-tool.service';
import { TileTypes } from '@common/tileType.constants';
import { BrushComponent } from '@app/components/edit-components/brush/brush.component';

@Component({
    selector: 'app-brush-grid',
    imports: [BrushComponent],
    templateUrl: './brush-grid.component.html',
    styleUrl: './brush-grid.component.scss',
})
export class BrushGridComponent {
    tileTypes = TileTypes; // ? dw about it, its needed

    constructor(protected readonly editingToolService: EditingToolService) {}

}
