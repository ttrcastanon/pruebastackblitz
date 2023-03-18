import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tiempo_de_remocionComponent } from './Tiempo_de_remocion.component';

describe('Tiempo_de_remocionComponent', () => {
  let component: Tiempo_de_remocionComponent;
  let fixture: ComponentFixture<Tiempo_de_remocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tiempo_de_remocionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tiempo_de_remocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

