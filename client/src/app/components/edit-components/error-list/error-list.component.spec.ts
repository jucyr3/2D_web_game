import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ErrorListComponent } from './error-list.component';
import { ClientHttpRequestsService } from '@app/services/client-http-requests.service';
import { provideHttpClient } from '@angular/common/http';

describe('ErrorListComponent', () => {
    let component: ErrorListComponent;
    let fixture: ComponentFixture<ErrorListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ErrorListComponent],
            providers: [ClientHttpRequestsService, provideHttpClientTesting(), provideHttpClient()],
        }).compileComponents();

        fixture = TestBed.createComponent(ErrorListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
