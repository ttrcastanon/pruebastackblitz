import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Razon_de_la_CompraComponent } from './Razon_de_la_Compra.component';

describe('Razon_de_la_CompraComponent', () => {
  let component: Razon_de_la_CompraComponent;
  let fixture: ComponentFixture<Razon_de_la_CompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Razon_de_la_CompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Razon_de_la_CompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

