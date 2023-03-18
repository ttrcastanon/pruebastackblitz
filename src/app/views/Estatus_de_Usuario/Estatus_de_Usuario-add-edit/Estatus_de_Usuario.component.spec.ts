import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_UsuarioComponent } from './Estatus_de_Usuario.component';

describe('Estatus_de_UsuarioComponent', () => {
  let component: Estatus_de_UsuarioComponent;
  let fixture: ComponentFixture<Estatus_de_UsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_UsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_UsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

