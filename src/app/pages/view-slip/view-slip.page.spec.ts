import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSlipPage } from './view-slip.page';

describe('ViewSlipPage', () => {
  let component: ViewSlipPage;
  let fixture: ComponentFixture<ViewSlipPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSlipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
