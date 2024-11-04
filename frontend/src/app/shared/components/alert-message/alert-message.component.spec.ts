import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SharedAlertMessageComponent} from './alert-message.component';

describe('SharedAlertMessageComponent', () => {
    let component: SharedAlertMessageComponent;
    let fixture: ComponentFixture<SharedAlertMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SharedAlertMessageComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SharedAlertMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
