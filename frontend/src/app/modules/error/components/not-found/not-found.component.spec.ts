import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorNotFoundComponent} from './not-found.component';

describe('ErrorNotFoundComponent', () => {
    let component: ErrorNotFoundComponent;
    let fixture: ComponentFixture<ErrorNotFoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ErrorNotFoundComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ErrorNotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
