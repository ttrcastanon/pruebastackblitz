import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLayout_Presupuestos_VentasComponent } from './list-Layout_Presupuestos_Ventas.component';

describe('ListLayout_Presupuestos_VentasComponent', () => {
  let component: ListLayout_Presupuestos_VentasComponent;
  let fixture: ComponentFixture<ListLayout_Presupuestos_VentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLayout_Presupuestos_VentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLayout_Presupuestos_VentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
