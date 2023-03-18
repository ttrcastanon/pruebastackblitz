import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Equipo_de_SupervivenciaComponent } from './show-advance-filter-Tipo_de_Equipo_de_Supervivencia.component';

describe('ShowAdvanceFilterTipo_de_Equipo_de_SupervivenciaComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Equipo_de_SupervivenciaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Equipo_de_SupervivenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Equipo_de_SupervivenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Equipo_de_SupervivenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
