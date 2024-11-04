import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutPartialSidebarComponent} from './sidebar.component';

describe('LayoutPartialSidebarComponent', () => {
    let component: LayoutPartialSidebarComponent;
    let fixture: ComponentFixture<LayoutPartialSidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LayoutPartialSidebarComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LayoutPartialSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
