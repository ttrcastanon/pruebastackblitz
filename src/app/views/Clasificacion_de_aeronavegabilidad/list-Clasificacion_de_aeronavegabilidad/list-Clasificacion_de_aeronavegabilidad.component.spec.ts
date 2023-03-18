import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClasificacion_de_aeronavegabilidadComponent } from './list-Clasificacion_de_aeronavegabilidad.component';

describe('ListClasificacion_de_aeronavegabilidadComponent', () => {
  let component: ListClasificacion_de_aeronavegabilidadComponent;
  let fixture: ComponentFixture<ListClasificacion_de_aeronavegabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListClasificacion_de_aeronavegabilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClasificacion_de_aeronavegabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
