import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_PilotoComponent } from './Tipo_de_Piloto.component';

describe('Tipo_de_PilotoComponent', () => {
  let component: Tipo_de_PilotoComponent;
  let fixture: ComponentFixture<Tipo_de_PilotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_PilotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_PilotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

