import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_HospedajeComponent } from './Tipo_de_Hospedaje.component';

describe('Tipo_de_HospedajeComponent', () => {
  let component: Tipo_de_HospedajeComponent;
  let fixture: ComponentFixture<Tipo_de_HospedajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_HospedajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_HospedajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

