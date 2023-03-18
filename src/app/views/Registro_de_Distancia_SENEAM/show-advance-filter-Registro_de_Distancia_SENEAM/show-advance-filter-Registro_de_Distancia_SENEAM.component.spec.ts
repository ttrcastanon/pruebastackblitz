import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterRegistro_de_Distancia_SENEAMComponent } from './show-advance-filter-Registro_de_Distancia_SENEAM.component';

describe('ShowAdvanceFilterRegistro_de_Distancia_SENEAMComponent', () => {
  let component: ShowAdvanceFilterRegistro_de_Distancia_SENEAMComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterRegistro_de_Distancia_SENEAMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterRegistro_de_Distancia_SENEAMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterRegistro_de_Distancia_SENEAMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
