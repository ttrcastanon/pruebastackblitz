import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Reabrir_vueloComponent } from './Reabrir_vuelo.component';

describe('Reabrir_vueloComponent', () => {
  let component: Reabrir_vueloComponent;
  let fixture: ComponentFixture<Reabrir_vueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Reabrir_vueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Reabrir_vueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

