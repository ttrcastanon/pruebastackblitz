import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Medio_de_ComunicacionComponent } from './show-advance-filter-Tipo_de_Medio_de_Comunicacion.component';

describe('ShowAdvanceFilterTipo_de_Medio_de_ComunicacionComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Medio_de_ComunicacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Medio_de_ComunicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Medio_de_ComunicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Medio_de_ComunicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
