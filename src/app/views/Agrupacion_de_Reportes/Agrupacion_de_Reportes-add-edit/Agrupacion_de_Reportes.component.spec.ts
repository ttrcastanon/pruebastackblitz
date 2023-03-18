import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Agrupacion_de_ReportesComponent } from './Agrupacion_de_Reportes.component';

describe('Agrupacion_de_ReportesComponent', () => {
  let component: Agrupacion_de_ReportesComponent;
  let fixture: ComponentFixture<Agrupacion_de_ReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Agrupacion_de_ReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Agrupacion_de_ReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

