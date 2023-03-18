import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Motivo_de_ViajeComponent } from './Motivo_de_Viaje.component';

describe('Motivo_de_ViajeComponent', () => {
  let component: Motivo_de_ViajeComponent;
  let fixture: ComponentFixture<Motivo_de_ViajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Motivo_de_ViajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Motivo_de_ViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

