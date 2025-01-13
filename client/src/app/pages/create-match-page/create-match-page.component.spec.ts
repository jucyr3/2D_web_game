import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMatchPageComponent } from './create-match-page.component';

describe('CreateMatchPageComponent', () => {
    let component: CreateMatchPageComponent;
    let fixture: ComponentFixture<CreateMatchPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateMatchPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateMatchPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
