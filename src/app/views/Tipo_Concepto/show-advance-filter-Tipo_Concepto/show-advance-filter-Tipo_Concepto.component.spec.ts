import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_ConceptoComponent } from './show-advance-filter-Tipo_Concepto.component';

describe('ShowAdvanceFilterTipo_ConceptoComponent', () => {
  let component: ShowAdvanceFilterTipo_ConceptoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_ConceptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_ConceptoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_ConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
