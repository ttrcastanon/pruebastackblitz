import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ingreso_a_almacenComponent } from './Ingreso_a_almacen.component';

describe('Ingreso_a_almacenComponent', () => {
  let component: Ingreso_a_almacenComponent;
  let fixture: ComponentFixture<Ingreso_a_almacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ingreso_a_almacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ingreso_a_almacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

