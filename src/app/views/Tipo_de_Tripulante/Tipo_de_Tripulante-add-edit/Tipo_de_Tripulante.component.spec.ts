import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_TripulanteComponent } from './Tipo_de_Tripulante.component';

describe('Tipo_de_TripulanteComponent', () => {
  let component: Tipo_de_TripulanteComponent;
  let fixture: ComponentFixture<Tipo_de_TripulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_TripulanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_TripulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

