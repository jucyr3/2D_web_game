import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-profile-picture',
    imports: [],
    templateUrl: './profile-picture.component.html',
    styleUrl: './profile-picture.component.scss',
})
export class ProfilePictureComponent {
    @Input() imagePath: string;
    @Input() isSelected = false;
    @Input() itemNumber: number;
    @Output() selected = new EventEmitter<number>();

    clickItem() {
        this.selected.emit(this.itemNumber);
    }
}
