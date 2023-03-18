import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasajerosComponent } from './Pasajeros.component';

describe('PasajerosComponent', () => {
  let component: PasajerosComponent;
  let fixture: ComponentFixture<PasajerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasajerosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasajerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

