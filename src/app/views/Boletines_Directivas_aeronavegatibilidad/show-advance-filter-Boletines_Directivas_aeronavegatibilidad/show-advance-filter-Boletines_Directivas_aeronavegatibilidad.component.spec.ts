import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterBoletines_Directivas_aeronavegatibilidadComponent } from './show-advance-filter-Boletines_Directivas_aeronavegatibilidad.component';

describe('ShowAdvanceFilterBoletines_Directivas_aeronavegatibilidadComponent', () => {
  let component: ShowAdvanceFilterBoletines_Directivas_aeronavegatibilidadComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterBoletines_Directivas_aeronavegatibilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterBoletines_Directivas_aeronavegatibilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterBoletines_Directivas_aeronavegatibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
