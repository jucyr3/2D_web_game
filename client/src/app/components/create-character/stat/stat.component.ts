import { Component } from '@angular/core';
import { ProfileService } from '@app/services/profile.service';

@Component({
    selector: 'app-stat',
    imports: [],
    templateUrl: './stat.component.html',
    styleUrl: './stat.component.scss',
})
export class StatComponent {
    cahnge: boolean = false;
    clickItem(value: boolean) {
        this.cahnge = value;
        this.profileService.setStatChoice(this.cahnge);
    }
    constructor(private profileService: ProfileService) {}
}
