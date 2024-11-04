import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActionLogDetailComponent } from './detail.component';

describe('AdminActionLogDetailComponent', () => {
  let component: AdminActionLogDetailComponent;
  let fixture: ComponentFixture<AdminActionLogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminActionLogDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminActionLogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
