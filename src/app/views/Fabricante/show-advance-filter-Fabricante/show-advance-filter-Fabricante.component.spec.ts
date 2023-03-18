import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterFabricanteComponent } from './show-advance-filter-Fabricante.component';

describe('ShowAdvanceFilterFabricanteComponent', () => {
  let component: ShowAdvanceFilterFabricanteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterFabricanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterFabricanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterFabricanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
