import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SiteLoaderComponent} from './site-loader.component';

describe('SiteLoaderComponent', () => {
    let component: SiteLoaderComponent;
    let fixture: ComponentFixture<SiteLoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SiteLoaderComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SiteLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
