import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Responsable_Incidencia_VueloComponent } from './Responsable_Incidencia_Vuelo.component';

describe('Responsable_Incidencia_VueloComponent', () => {
  let component: Responsable_Incidencia_VueloComponent;
  let fixture: ComponentFixture<Responsable_Incidencia_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Responsable_Incidencia_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Responsable_Incidencia_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

