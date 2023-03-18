import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterDiscrepancias_Pendientes_SalidaComponent } from './show-advance-filter-Discrepancias_Pendientes_Salida.component';

describe('ShowAdvanceFilterDiscrepancias_Pendientes_SalidaComponent', () => {
  let component: ShowAdvanceFilterDiscrepancias_Pendientes_SalidaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterDiscrepancias_Pendientes_SalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterDiscrepancias_Pendientes_SalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterDiscrepancias_Pendientes_SalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
