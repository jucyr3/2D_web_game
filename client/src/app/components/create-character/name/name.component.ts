import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProfileService } from '@app/services/profile.service';

@Component({
    selector: 'app-name',
    imports: [],
    templateUrl: './name.component.html',
    styleUrl: './name.component.scss',
})
export class NameComponent {
    @ViewChild('nameInput') nameInput: ElementRef;
    name: string = '';

    constructor(private profileService: ProfileService) {}
    changeName() {
        this.name = this.nameInput.nativeElement.value;
        this.profileService.setName(this.name);
    }
}
