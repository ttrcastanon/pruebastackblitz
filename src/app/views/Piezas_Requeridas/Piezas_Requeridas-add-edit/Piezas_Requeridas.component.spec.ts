import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Piezas_RequeridasComponent } from './Piezas_Requeridas.component';

describe('Piezas_RequeridasComponent', () => {
  let component: Piezas_RequeridasComponent;
  let fixture: ComponentFixture<Piezas_RequeridasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Piezas_RequeridasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Piezas_RequeridasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

