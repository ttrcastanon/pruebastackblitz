import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_CalibracionComponent } from './Estatus_de_Calibracion.component';

describe('Estatus_de_CalibracionComponent', () => {
  let component: Estatus_de_CalibracionComponent;
  let fixture: ComponentFixture<Estatus_de_CalibracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_CalibracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_CalibracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

