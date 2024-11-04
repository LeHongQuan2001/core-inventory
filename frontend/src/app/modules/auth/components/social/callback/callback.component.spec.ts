import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthSocialCallbackComponent} from './callback.component';

describe('AuthSocialCallbackComponent', () => {
    let component: AuthSocialCallbackComponent;
    let fixture: ComponentFixture<AuthSocialCallbackComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AuthSocialCallbackComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AuthSocialCallbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
