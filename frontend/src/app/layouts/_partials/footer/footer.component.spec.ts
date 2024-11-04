import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutPartialFooterComponent} from './footer.component';

describe('LayoutPartialFooterComponent', () => {
    let component: LayoutPartialFooterComponent;
    let fixture: ComponentFixture<LayoutPartialFooterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LayoutPartialFooterComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LayoutPartialFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
