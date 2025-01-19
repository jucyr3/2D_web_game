import { Component } from '@angular/core';

@Component({
    selector: 'app-profile-picture',
    imports: [],
    templateUrl: './profile-picture.component.html',
    styleUrl: './profile-picture.component.scss',
})
export class ProfilePictureComponent {
    imagePath = 'assets/images/1.jpg';
    isSelected: boolean = false;
    clickItem() {
        this.isSelected = !this.isSelected;
    }
    // @Input() imgSrc: string;
    // constructor() {}
}
