import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Concepto_de_Comisariato_NormalComponent } from './Concepto_de_Comisariato_Normal.component';

describe('Concepto_de_Comisariato_NormalComponent', () => {
  let component: Concepto_de_Comisariato_NormalComponent;
  let fixture: ComponentFixture<Concepto_de_Comisariato_NormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Concepto_de_Comisariato_NormalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Concepto_de_Comisariato_NormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

