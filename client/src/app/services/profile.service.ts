import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
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
    private _itemSelected = signal<number>(1);
    private _diceChoicee: boolean = false;
    private _statChoice: boolean = false;
    private _name: string = '';

    setSelectedItem(value: number) {
        this._itemSelected.set(value);
    }
    getSelectedItem() {
        return this._itemSelected;
    }
    
    getdiceChoice() {
        return this._diceChoicee;
    }
    getstatChoice() {
        return this._statChoice;
    }

    showImageSelected() {
        return this.imagesPath[this._itemSelected() - 1].imagePath;
    }
    getName() {
        return this._name;
    }
    setDiceChoice(value: boolean) {
        this._diceChoicee = value;
    }
    setStatChoice(value: boolean) {
        this._statChoice = value;
    }
    setName(name: string) {
        this._name = name;
    }

    constructor() {}
}
