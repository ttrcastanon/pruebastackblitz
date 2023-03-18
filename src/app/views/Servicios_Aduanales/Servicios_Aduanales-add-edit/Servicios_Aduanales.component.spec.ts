import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Servicios_AduanalesComponent } from './Servicios_Aduanales.component';

describe('Servicios_AduanalesComponent', () => {
  let component: Servicios_AduanalesComponent;
  let fixture: ComponentFixture<Servicios_AduanalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Servicios_AduanalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Servicios_AduanalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

