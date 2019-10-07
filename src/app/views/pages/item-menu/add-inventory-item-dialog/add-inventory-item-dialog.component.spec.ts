import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryItemDialogComponent } from './add-inventory-item-dialog.component';

describe('AddInventoryItemDialogComponent', () => {
  let component: AddInventoryItemDialogComponent;
  let fixture: ComponentFixture<AddInventoryItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInventoryItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
