import { TestBed } from '@angular/core/testing';

import { EditingToolService } from './editing-tool.service';

describe('EditingToolService', () => {
    let service: EditingToolService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EditingToolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
