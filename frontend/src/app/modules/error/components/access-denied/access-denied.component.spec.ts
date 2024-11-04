import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorAccessDeniedComponent} from './access-denied.component';

describe('ErrorAccessDeniedComponent', () => {
    let component: ErrorAccessDeniedComponent;
    let fixture: ComponentFixture<ErrorAccessDeniedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ErrorAccessDeniedComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ErrorAccessDeniedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
