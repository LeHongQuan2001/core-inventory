import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutPartialHeaderComponent} from './header.component';

describe('LayoutPartialHeaderComponent', () => {
    let component: LayoutPartialHeaderComponent;
    let fixture: ComponentFixture<LayoutPartialHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LayoutPartialHeaderComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LayoutPartialHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
