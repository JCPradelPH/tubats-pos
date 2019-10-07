import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetInventoryComponent } from './set-inventory.component';

describe('SetInventoryComponent', () => {
  let component: SetInventoryComponent;
  let fixture: ComponentFixture<SetInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
