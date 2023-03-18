import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_AeropuertoComponent } from './Tipo_de_Aeropuerto.component';

describe('Tipo_de_AeropuertoComponent', () => {
  let component: Tipo_de_AeropuertoComponent;
  let fixture: ComponentFixture<Tipo_de_AeropuertoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_AeropuertoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_AeropuertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

