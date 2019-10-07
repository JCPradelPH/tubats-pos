import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetItemMenuComponent } from './set-item-menu.component';

describe('SetItemMenuComponent', () => {
  let component: SetItemMenuComponent;
  let fixture: ComponentFixture<SetItemMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetItemMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetItemMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
