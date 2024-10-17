import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAllSlipsPage } from './view-all-slips.page';

describe('ViewAllSlipsPage', () => {
  let component: ViewAllSlipsPage;
  let fixture: ComponentFixture<ViewAllSlipsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllSlipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
