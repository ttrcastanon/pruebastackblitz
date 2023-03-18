import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cat__reportes_prestablecidosComponent } from './Cat__reportes_prestablecidos.component';

describe('Cat__reportes_prestablecidosComponent', () => {
  let component: Cat__reportes_prestablecidosComponent;
  let fixture: ComponentFixture<Cat__reportes_prestablecidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Cat__reportes_prestablecidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Cat__reportes_prestablecidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

