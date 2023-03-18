import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_GastoComponent } from './Tipo_de_Gasto.component';

describe('Tipo_de_GastoComponent', () => {
  let component: Tipo_de_GastoComponent;
  let fixture: ComponentFixture<Tipo_de_GastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_GastoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_GastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

