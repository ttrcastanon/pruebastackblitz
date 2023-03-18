import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Razon_de_Rechazo_a_AlmacenComponent } from './Razon_de_Rechazo_a_Almacen.component';

describe('Razon_de_Rechazo_a_AlmacenComponent', () => {
  let component: Razon_de_Rechazo_a_AlmacenComponent;
  let fixture: ComponentFixture<Razon_de_Rechazo_a_AlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Razon_de_Rechazo_a_AlmacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Razon_de_Rechazo_a_AlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

