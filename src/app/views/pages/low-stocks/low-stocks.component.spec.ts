import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowStocksComponent } from './low-stocks.component';

describe('LowStocksComponent', () => {
  let component: LowStocksComponent;
  let fixture: ComponentFixture<LowStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
