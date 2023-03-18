import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Catalogo_serviciosComponent } from './Catalogo_servicios.component';

describe('Catalogo_serviciosComponent', () => {
  let component: Catalogo_serviciosComponent;
  let fixture: ComponentFixture<Catalogo_serviciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Catalogo_serviciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Catalogo_serviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

