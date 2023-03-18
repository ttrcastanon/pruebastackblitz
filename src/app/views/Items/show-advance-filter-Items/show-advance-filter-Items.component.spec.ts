import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterItemsComponent } from './show-advance-filter-Items.component';

describe('ShowAdvanceFilterItemsComponent', () => {
  let component: ShowAdvanceFilterItemsComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
