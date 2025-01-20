import { Component, EventEmitter, Output } from '@angular/core';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';

@Component({
    selector: 'app-profile-selection',
    imports: [ProfilePictureComponent],
    templateUrl: './profile-selection.component.html',
    styleUrl: './profile-selection.component.scss',
})
export class ProfileSelectionComponent {
    imagesPath = [
        { id: 1, imagePath: 'assets/images/1.jpg' },
        { id: 2, imagePath: 'assets/images/2.jpg' },
        { id: 3, imagePath: 'assets/images/3.jpg' },
        { id: 4, imagePath: 'assets/images/4.jpg' },
        { id: 5, imagePath: 'assets/images/5.jpg' },
        { id: 6, imagePath: 'assets/images/6.jpg' },
        { id: 7, imagePath: 'assets/images/7.jpg' },
        { id: 8, imagePath: 'assets/images/8.jpg' },
        { id: 9, imagePath: 'assets/images/9.jpg' },
        { id: 10, imagePath: 'assets/images/10.jpg' },
        { id: 11, imagePath: 'assets/images/11.jpg' },
        { id: 12, imagePath: 'assets/images/12.jpg' },
    ];
    itemSelected: number = 1;
    @Output() selected = new EventEmitter<number>();
    clickItem(event: number) {
        this.selected.emit(event);
        this.itemSelected = event;
    }
}
