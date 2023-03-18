import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Equipo_de_NavegacionComponent } from './Equipo_de_Navegacion.component';

describe('Equipo_de_NavegacionComponent', () => {
  let component: Equipo_de_NavegacionComponent;
  let fixture: ComponentFixture<Equipo_de_NavegacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Equipo_de_NavegacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Equipo_de_NavegacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

