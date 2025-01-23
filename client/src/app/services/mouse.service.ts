import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MouseService {
    isMouseDown = false;
    isRightClick = false;

    // TODO add mouse payload for drag and drop
}
