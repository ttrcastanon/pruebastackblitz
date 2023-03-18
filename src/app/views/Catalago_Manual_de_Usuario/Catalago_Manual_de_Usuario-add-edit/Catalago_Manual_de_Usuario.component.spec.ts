import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Catalago_Manual_de_UsuarioComponent } from './Catalago_Manual_de_Usuario.component';

describe('Catalago_Manual_de_UsuarioComponent', () => {
  let component: Catalago_Manual_de_UsuarioComponent;
  let fixture: ComponentFixture<Catalago_Manual_de_UsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Catalago_Manual_de_UsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Catalago_Manual_de_UsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

