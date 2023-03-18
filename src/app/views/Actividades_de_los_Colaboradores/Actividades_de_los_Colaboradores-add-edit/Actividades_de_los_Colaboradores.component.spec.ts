import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Actividades_de_los_ColaboradoresComponent } from './Actividades_de_los_Colaboradores.component';

describe('Actividades_de_los_ColaboradoresComponent', () => {
  let component: Actividades_de_los_ColaboradoresComponent;
  let fixture: ComponentFixture<Actividades_de_los_ColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Actividades_de_los_ColaboradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Actividades_de_los_ColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

