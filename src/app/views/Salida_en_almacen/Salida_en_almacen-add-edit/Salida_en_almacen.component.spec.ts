import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Salida_en_almacenComponent } from './Salida_en_almacen.component';

describe('Salida_en_almacenComponent', () => {
  let component: Salida_en_almacenComponent;
  let fixture: ComponentFixture<Salida_en_almacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Salida_en_almacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Salida_en_almacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

