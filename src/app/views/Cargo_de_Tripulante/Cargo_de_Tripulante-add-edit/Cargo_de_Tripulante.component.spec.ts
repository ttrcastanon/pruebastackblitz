import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cargo_de_TripulanteComponent } from './Cargo_de_Tripulante.component';

describe('Cargo_de_TripulanteComponent', () => {
  let component: Cargo_de_TripulanteComponent;
  let fixture: ComponentFixture<Cargo_de_TripulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Cargo_de_TripulanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Cargo_de_TripulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

