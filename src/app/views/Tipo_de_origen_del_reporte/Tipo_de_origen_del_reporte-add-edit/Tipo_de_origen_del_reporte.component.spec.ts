import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_origen_del_reporteComponent } from './Tipo_de_origen_del_reporte.component';

describe('Tipo_de_origen_del_reporteComponent', () => {
  let component: Tipo_de_origen_del_reporteComponent;
  let fixture: ComponentFixture<Tipo_de_origen_del_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_origen_del_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_origen_del_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

