import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDiscrepancias_Pendientes_SalidaComponent } from './list-Discrepancias_Pendientes_Salida.component';

describe('ListDiscrepancias_Pendientes_SalidaComponent', () => {
  let component: ListDiscrepancias_Pendientes_SalidaComponent;
  let fixture: ComponentFixture<ListDiscrepancias_Pendientes_SalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDiscrepancias_Pendientes_SalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDiscrepancias_Pendientes_SalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
