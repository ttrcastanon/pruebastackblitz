import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListListado_de_Directivas_de_aeronavegabilidadComponent } from './list-Listado_de_Directivas_de_aeronavegabilidad.component';

describe('ListListado_de_Directivas_de_aeronavegabilidadComponent', () => {
  let component: ListListado_de_Directivas_de_aeronavegabilidadComponent;
  let fixture: ComponentFixture<ListListado_de_Directivas_de_aeronavegabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListListado_de_Directivas_de_aeronavegabilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListListado_de_Directivas_de_aeronavegabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
