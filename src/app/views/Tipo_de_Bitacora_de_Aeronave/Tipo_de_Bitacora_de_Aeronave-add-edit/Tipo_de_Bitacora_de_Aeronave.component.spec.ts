import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Bitacora_de_AeronaveComponent } from './Tipo_de_Bitacora_de_Aeronave.component';

describe('Tipo_de_Bitacora_de_AeronaveComponent', () => {
  let component: Tipo_de_Bitacora_de_AeronaveComponent;
  let fixture: ComponentFixture<Tipo_de_Bitacora_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Bitacora_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Bitacora_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

