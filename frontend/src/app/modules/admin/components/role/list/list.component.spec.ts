import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminRoleListComponent} from './list.component';

describe('AdminRoleListComponent', () => {
    let component: AdminRoleListComponent;
    let fixture: ComponentFixture<AdminRoleListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminRoleListComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AdminRoleListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
