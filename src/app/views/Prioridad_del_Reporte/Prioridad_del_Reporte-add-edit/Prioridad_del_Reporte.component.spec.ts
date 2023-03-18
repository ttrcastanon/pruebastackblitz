import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Prioridad_del_ReporteComponent } from './Prioridad_del_Reporte.component';

describe('Prioridad_del_ReporteComponent', () => {
  let component: Prioridad_del_ReporteComponent;
  let fixture: ComponentFixture<Prioridad_del_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Prioridad_del_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Prioridad_del_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

