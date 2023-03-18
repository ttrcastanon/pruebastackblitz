import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Discrepancias_Pendientes_SalidaComponent } from './Discrepancias_Pendientes_Salida.component';

describe('Discrepancias_Pendientes_SalidaComponent', () => {
  let component: Discrepancias_Pendientes_SalidaComponent;
  let fixture: ComponentFixture<Discrepancias_Pendientes_SalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Discrepancias_Pendientes_SalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Discrepancias_Pendientes_SalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

