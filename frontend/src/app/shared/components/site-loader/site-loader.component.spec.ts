import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SharedSiteLoaderComponent} from './site-loader.component';

describe('SharedSiteLoaderComponent', () => {
    let component: SharedSiteLoaderComponent;
    let fixture: ComponentFixture<SharedSiteLoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SharedSiteLoaderComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SharedSiteLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
