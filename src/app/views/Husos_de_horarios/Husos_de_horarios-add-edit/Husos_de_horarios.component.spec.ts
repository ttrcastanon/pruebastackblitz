import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Husos_de_horariosComponent } from './Husos_de_horarios.component';

describe('Husos_de_horariosComponent', () => {
  let component: Husos_de_horariosComponent;
  let fixture: ComponentFixture<Husos_de_horariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Husos_de_horariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Husos_de_horariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

