import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConfiguracion_de_tecnicos_e_inspectoresComponent } from './list-Configuracion_de_tecnicos_e_inspectores.component';

describe('ListConfiguracion_de_tecnicos_e_inspectoresComponent', () => {
  let component: ListConfiguracion_de_tecnicos_e_inspectoresComponent;
  let fixture: ComponentFixture<ListConfiguracion_de_tecnicos_e_inspectoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConfiguracion_de_tecnicos_e_inspectoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConfiguracion_de_tecnicos_e_inspectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
