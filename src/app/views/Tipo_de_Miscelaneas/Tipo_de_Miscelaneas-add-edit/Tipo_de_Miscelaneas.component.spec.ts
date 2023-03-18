import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_MiscelaneasComponent } from './Tipo_de_Miscelaneas.component';

describe('Tipo_de_MiscelaneasComponent', () => {
  let component: Tipo_de_MiscelaneasComponent;
  let fixture: ComponentFixture<Tipo_de_MiscelaneasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_MiscelaneasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_MiscelaneasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

