import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_AvisoComponent } from './Tipo_de_Aviso.component';

describe('Tipo_de_AvisoComponent', () => {
  let component: Tipo_de_AvisoComponent;
  let fixture: ComponentFixture<Tipo_de_AvisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_AvisoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_AvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

