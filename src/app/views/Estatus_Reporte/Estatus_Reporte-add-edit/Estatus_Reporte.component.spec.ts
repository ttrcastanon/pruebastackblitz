import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_ReporteComponent } from './Estatus_Reporte.component';

describe('Estatus_ReporteComponent', () => {
  let component: Estatus_ReporteComponent;
  let fixture: ComponentFixture<Estatus_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

