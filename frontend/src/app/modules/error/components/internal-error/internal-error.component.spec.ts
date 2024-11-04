import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorInternalErrorComponent} from './internal-error.component';

describe('ErrorInternalErrorComponent', () => {
    let component: ErrorInternalErrorComponent;
    let fixture: ComponentFixture<ErrorInternalErrorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ErrorInternalErrorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ErrorInternalErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
