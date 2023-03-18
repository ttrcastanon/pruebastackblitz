import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Documentacion_de_AeronaveComponent } from './Documentacion_de_Aeronave.component';

describe('Documentacion_de_AeronaveComponent', () => {
  let component: Documentacion_de_AeronaveComponent;
  let fixture: ComponentFixture<Documentacion_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Documentacion_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Documentacion_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

