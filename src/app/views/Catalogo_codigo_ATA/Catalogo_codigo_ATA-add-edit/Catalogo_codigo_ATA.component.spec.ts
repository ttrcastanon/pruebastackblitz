import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Catalogo_codigo_ATAComponent } from './Catalogo_codigo_ATA.component';

describe('Catalogo_codigo_ATAComponent', () => {
  let component: Catalogo_codigo_ATAComponent;
  let fixture: ComponentFixture<Catalogo_codigo_ATAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Catalogo_codigo_ATAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Catalogo_codigo_ATAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

