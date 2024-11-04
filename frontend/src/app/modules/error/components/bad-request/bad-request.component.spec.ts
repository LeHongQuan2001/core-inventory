import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorBadRequestComponent} from './bad-request.component';

describe('ErrorBadRequestComponent', () => {
    let component: ErrorBadRequestComponent;
    let fixture: ComponentFixture<ErrorBadRequestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ErrorBadRequestComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ErrorBadRequestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
