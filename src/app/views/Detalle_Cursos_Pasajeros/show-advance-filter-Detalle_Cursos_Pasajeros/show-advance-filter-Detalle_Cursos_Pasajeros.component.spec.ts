import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterDetalle_Cursos_PasajerosComponent } from './show-advance-filter-Detalle_Cursos_Pasajeros.component';

describe('ShowAdvanceFilterDetalle_Cursos_PasajerosComponent', () => {
  let component: ShowAdvanceFilterDetalle_Cursos_PasajerosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterDetalle_Cursos_PasajerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterDetalle_Cursos_PasajerosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterDetalle_Cursos_PasajerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
