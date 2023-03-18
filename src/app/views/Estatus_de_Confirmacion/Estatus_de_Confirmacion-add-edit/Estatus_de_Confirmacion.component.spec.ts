import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_ConfirmacionComponent } from './Estatus_de_Confirmacion.component';

describe('Estatus_de_ConfirmacionComponent', () => {
  let component: Estatus_de_ConfirmacionComponent;
  let fixture: ComponentFixture<Estatus_de_ConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_ConfirmacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_ConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

