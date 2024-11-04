import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutErrorComponent} from './error.component';

describe('LayoutErrorComponent', () => {
    let component: LayoutErrorComponent;
    let fixture: ComponentFixture<LayoutErrorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LayoutErrorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LayoutErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
