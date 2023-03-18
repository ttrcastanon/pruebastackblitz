import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout_Presupuestos_VentasComponent } from './Layout_Presupuestos_Ventas.component';

describe('Layout_Presupuestos_VentasComponent', () => {
  let component: Layout_Presupuestos_VentasComponent;
  let fixture: ComponentFixture<Layout_Presupuestos_VentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Layout_Presupuestos_VentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Layout_Presupuestos_VentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

