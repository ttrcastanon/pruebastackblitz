import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout_Cuentas_por_pagarComponent } from './Layout_Cuentas_por_pagar.component';

describe('Layout_Cuentas_por_pagarComponent', () => {
  let component: Layout_Cuentas_por_pagarComponent;
  let fixture: ComponentFixture<Layout_Cuentas_por_pagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Layout_Cuentas_por_pagarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Layout_Cuentas_por_pagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

