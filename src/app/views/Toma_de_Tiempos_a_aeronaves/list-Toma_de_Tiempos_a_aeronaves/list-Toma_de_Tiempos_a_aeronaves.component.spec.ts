import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListToma_de_Tiempos_a_aeronavesComponent } from './list-Toma_de_Tiempos_a_aeronaves.component';

describe('ListToma_de_Tiempos_a_aeronavesComponent', () => {
  let component: ListToma_de_Tiempos_a_aeronavesComponent;
  let fixture: ComponentFixture<ListToma_de_Tiempos_a_aeronavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListToma_de_Tiempos_a_aeronavesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListToma_de_Tiempos_a_aeronavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
