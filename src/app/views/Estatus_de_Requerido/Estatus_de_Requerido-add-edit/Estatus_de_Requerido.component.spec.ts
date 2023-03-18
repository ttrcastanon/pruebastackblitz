import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_RequeridoComponent } from './Estatus_de_Requerido.component';

describe('Estatus_de_RequeridoComponent', () => {
  let component: Estatus_de_RequeridoComponent;
  let fixture: ComponentFixture<Estatus_de_RequeridoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_RequeridoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_RequeridoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

