import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Medio_de_ComunicacionComponent } from './Medio_de_Comunicacion.component';

describe('Medio_de_ComunicacionComponent', () => {
  let component: Medio_de_ComunicacionComponent;
  let fixture: ComponentFixture<Medio_de_ComunicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Medio_de_ComunicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Medio_de_ComunicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

