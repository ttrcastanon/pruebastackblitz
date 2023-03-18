import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_AlaComponent } from './Tipo_de_Ala.component';

describe('Tipo_de_AlaComponent', () => {
  let component: Tipo_de_AlaComponent;
  let fixture: ComponentFixture<Tipo_de_AlaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_AlaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_AlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

