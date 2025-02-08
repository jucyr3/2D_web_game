import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorListComponent } from './error-list.component';
import { ClientHttpRequestsService } from '@app/services/client-http-requests.service';

describe('ErrorListComponent', () => {
    let component: ErrorListComponent;
    let fixture: ComponentFixture<ErrorListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ErrorListComponent,
                HttpClientTestingModule
            ],
            providers: [
                ClientHttpRequestsService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ErrorListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
