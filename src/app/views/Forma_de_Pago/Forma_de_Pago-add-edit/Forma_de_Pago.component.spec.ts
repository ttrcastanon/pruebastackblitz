import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Forma_de_PagoComponent } from './Forma_de_Pago.component';

describe('Forma_de_PagoComponent', () => {
  let component: Forma_de_PagoComponent;
  let fixture: ComponentFixture<Forma_de_PagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Forma_de_PagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Forma_de_PagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

