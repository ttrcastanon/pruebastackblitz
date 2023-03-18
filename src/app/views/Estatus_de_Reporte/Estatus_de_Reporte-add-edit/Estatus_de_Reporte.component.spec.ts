import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_ReporteComponent } from './Estatus_de_Reporte.component';

describe('Estatus_de_ReporteComponent', () => {
  let component: Estatus_de_ReporteComponent;
  let fixture: ComponentFixture<Estatus_de_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

