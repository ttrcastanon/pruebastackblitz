import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Servicios_AduanalesComponent } from './Tipo_de_Servicios_Aduanales.component';

describe('Tipo_de_Servicios_AduanalesComponent', () => {
  let component: Tipo_de_Servicios_AduanalesComponent;
  let fixture: ComponentFixture<Tipo_de_Servicios_AduanalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Servicios_AduanalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Servicios_AduanalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

