import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActionLogListComponent } from './list.component';

describe('AdminActionLogListComponent', () => {
  let component: AdminActionLogListComponent;
  let fixture: ComponentFixture<AdminActionLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminActionLogListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminActionLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
