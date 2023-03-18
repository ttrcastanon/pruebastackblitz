import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Folios_Generacion_OCComponent } from './Folios_Generacion_OC.component';

describe('Folios_Generacion_OCComponent', () => {
  let component: Folios_Generacion_OCComponent;
  let fixture: ComponentFixture<Folios_Generacion_OCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Folios_Generacion_OCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Folios_Generacion_OCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

