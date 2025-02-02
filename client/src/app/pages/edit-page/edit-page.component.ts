import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BrushGridComponent } from '@app/components/edit-components/brush-grid/brush-grid.component';
import { DescriptionComponent } from '@app/components/edit-components/description/description.component';
import { TitleComponent } from '@app/components/edit-components/title/title.component';
import { ItemGridComponent } from '@app/components/edit-components/item-grid/item-grid.component';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';
import { ResetButtonComponent } from '@app/components/edit-components/reset-button/reset-button.component';
import { SaveButtonComponent } from '@app/components/edit-components/save-button/save-button.component';
import { TileGridComponent } from '@app/components/edit-components/tile-grid/tile-grid.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PopUpComponent } from '@app/components/pop-up/pop-up.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-page',
    imports: [
        TileGridComponent,
        BrushGridComponent,
        ItemGridComponent,
        NgStyle,
        TitleComponent,
        DescriptionComponent,
        SaveButtonComponent,
        ResetButtonComponent,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
    ],
    templateUrl: './edit-page.component.html',
    styleUrl: './edit-page.component.scss',
    providers: [EditingToolService],
})
export class EditPageComponent implements OnInit {
    title = this.mapService.map.name;
    description = this.mapService.map.description;

    constructor(
        private readonly mouseService: MouseService,
        protected mapService: MapService,
        protected dragAndDropService: DragAndDropService,
        readonly dialog: MatDialog,
        private readonly router: Router,
    ) {}

    ngOnInit() {
        // preload image in cache
        const img = new Image();
        img.src = 'assets/tiles/openDoorTile.png';
    }

    onMouseDown(event: MouseEvent) {
        this.mouseService.isMouseDown = true;
        this.mouseService.isRightClick = event.button === 2; // 1: left-click, 2: right-click (MDN Web Docs)
    }

    onMouseUp(): void {
        this.mouseService.isMouseDown = false;

        const item = this.dragAndDropService.currentDraggedItem;
        if (item) {
            this.dragAndDropService.handleDraggedItemPlacement(-1, -1);
            this.dragAndDropService.onMouseUp(item.name);
        }
    }

    onDragEnd() {
        this.mouseService.isMouseDown = false;
    }

    onMouseLeave() {
        this.onMouseUp();
    }

    onMouseMove(event: MouseEvent): void {
        const item = this.dragAndDropService.currentDraggedItem;
        if (item) {
            this.dragAndDropService.onMouseMove(item.name, event);
        }
    }

    onDescriptionInput(event: Event) {
        this.description = (event.target as HTMLInputElement).value;
    }

    onBlur() {
        this.updateValue();
    }

    updateValue() {
        if (!this.title || this.title.trim() === '') {
            this.title = 'Untitled'; // Reset to default if empty
        }
        this.mapService.map.name = this.title;
        this.mapService.map.description = this.description;
        // Add any additional logic you need to handle the updated value
    }

    openQuitDialog(): void {
        const dialogRef = this.dialog.open(PopUpComponent, {
            width: '35%',
            data: {
                title: 'Confirmer la sortie',
                content: 'Quitter maintenant annulera vos modifications. Êtes-vous sûr de vouloir quitter?',
                cancelButtonLabel: 'Non',
                confirmButtonLabel: 'Oui',
            },
        });
        dialogRef.componentInstance.confirmed.subscribe((result: boolean) => {
            if (result) {
                dialogRef.close();
                this.router.navigate(['/home']);
            }
        });
    }
}
