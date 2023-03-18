import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_productoComponent } from './Tipo_de_producto.component';

describe('Tipo_de_productoComponent', () => {
  let component: Tipo_de_productoComponent;
  let fixture: ComponentFixture<Tipo_de_productoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_productoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_productoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

