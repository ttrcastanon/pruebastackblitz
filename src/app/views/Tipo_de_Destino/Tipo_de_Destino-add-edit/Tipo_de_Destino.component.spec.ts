import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_DestinoComponent } from './Tipo_de_Destino.component';

describe('Tipo_de_DestinoComponent', () => {
  let component: Tipo_de_DestinoComponent;
  let fixture: ComponentFixture<Tipo_de_DestinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_DestinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_DestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

