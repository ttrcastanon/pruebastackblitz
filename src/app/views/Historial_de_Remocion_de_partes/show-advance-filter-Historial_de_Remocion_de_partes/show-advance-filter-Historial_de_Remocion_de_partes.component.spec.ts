import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterHistorial_de_Remocion_de_partesComponent } from './show-advance-filter-Historial_de_Remocion_de_partes.component';

describe('ShowAdvanceFilterHistorial_de_Remocion_de_partesComponent', () => {
  let component: ShowAdvanceFilterHistorial_de_Remocion_de_partesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterHistorial_de_Remocion_de_partesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterHistorial_de_Remocion_de_partesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterHistorial_de_Remocion_de_partesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
