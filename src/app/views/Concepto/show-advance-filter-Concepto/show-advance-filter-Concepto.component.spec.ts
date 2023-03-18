import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterConceptoComponent } from './show-advance-filter-Concepto.component';

describe('ShowAdvanceFilterConceptoComponent', () => {
  let component: ShowAdvanceFilterConceptoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterConceptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterConceptoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
