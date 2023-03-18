import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRegistro_de_Distancia_SENEAMComponent } from './list-Registro_de_Distancia_SENEAM.component';

describe('ListRegistro_de_Distancia_SENEAMComponent', () => {
  let component: ListRegistro_de_Distancia_SENEAMComponent;
  let fixture: ComponentFixture<ListRegistro_de_Distancia_SENEAMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRegistro_de_Distancia_SENEAMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRegistro_de_Distancia_SENEAMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
