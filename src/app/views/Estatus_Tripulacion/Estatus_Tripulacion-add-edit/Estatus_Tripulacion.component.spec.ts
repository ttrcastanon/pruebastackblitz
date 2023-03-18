import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_TripulacionComponent } from './Estatus_Tripulacion.component';

describe('Estatus_TripulacionComponent', () => {
  let component: Estatus_TripulacionComponent;
  let fixture: ComponentFixture<Estatus_TripulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_TripulacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_TripulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

