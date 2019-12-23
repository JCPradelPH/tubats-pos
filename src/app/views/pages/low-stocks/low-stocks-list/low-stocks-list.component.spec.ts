import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowStocksListComponent } from './low-stocks-list.component';

describe('LowStocksListComponent', () => {
  let component: LowStocksListComponent;
  let fixture: ComponentFixture<LowStocksListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowStocksListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowStocksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
