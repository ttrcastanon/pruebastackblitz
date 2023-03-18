import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_ReporteComponent } from './Tipo_de_Reporte.component';

describe('Tipo_de_ReporteComponent', () => {
  let component: Tipo_de_ReporteComponent;
  let fixture: ComponentFixture<Tipo_de_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

