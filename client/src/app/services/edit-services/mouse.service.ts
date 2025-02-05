import { Injectable } from '@angular/core';

export enum MouseButton {
    Left = 0,
    Right = 2,
}

@Injectable({
    providedIn: 'root',
})
export class MouseService {
    isMouseDown = false;
    isRightClick = false;
}
