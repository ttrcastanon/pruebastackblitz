import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Horarios_de_TrabajoComponent } from './Horarios_de_Trabajo.component';

describe('Horarios_de_TrabajoComponent', () => {
  let component: Horarios_de_TrabajoComponent;
  let fixture: ComponentFixture<Horarios_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Horarios_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Horarios_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

