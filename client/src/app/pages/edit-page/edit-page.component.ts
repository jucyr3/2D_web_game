import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { TileComponent } from '@app/components/tile/tile.component';

@Component({
  selector: 'app-edit-page',
  imports: [NgFor, TileComponent],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss'
})
export class EditPageComponent {
  mapSize = 20;
  isMouseDown = false;

  onMouseDown(isMouseDown: boolean) {
    this.isMouseDown = isMouseDown;
  }
}

//<div *ngFor="let cell of [].constructor(400); let i = index" (click)="onCellClick(i)" [attr.id]="'tile-' + i" style="border: 1px solid #000; background-color: white;"></div>
