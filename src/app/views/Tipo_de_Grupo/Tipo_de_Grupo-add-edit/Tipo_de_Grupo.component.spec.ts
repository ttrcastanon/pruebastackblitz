import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_GrupoComponent } from './Tipo_de_Grupo.component';

describe('Tipo_de_GrupoComponent', () => {
  let component: Tipo_de_GrupoComponent;
  let fixture: ComponentFixture<Tipo_de_GrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_GrupoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_GrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

