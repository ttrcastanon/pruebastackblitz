import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Equipo_de_SupervivenciaComponent } from './list-Tipo_de_Equipo_de_Supervivencia.component';

describe('ListTipo_de_Equipo_de_SupervivenciaComponent', () => {
  let component: ListTipo_de_Equipo_de_SupervivenciaComponent;
  let fixture: ComponentFixture<ListTipo_de_Equipo_de_SupervivenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Equipo_de_SupervivenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Equipo_de_SupervivenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
