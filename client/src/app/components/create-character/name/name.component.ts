import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProfileService } from '@app/services/profile.service';

@Component({
    selector: 'app-name',
    imports: [],
    templateUrl: './name.component.html',
    styleUrl: './name.component.scss',
})
export class NameComponent {
    name: string = '';
    @ViewChild('nameInput') nameInput: ElementRef;
    changeName() {
        this.name = this.nameInput.nativeElement.value;
        this.profileService.setName(this.name);
    }
    constructor(private profileService: ProfileService) {}
}
