import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorListComponent } from './error-list.component';

describe('ErrorListComponent', () => {
    let component: ErrorListComponent;
    let fixture: ComponentFixture<ErrorListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ErrorListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ErrorListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
