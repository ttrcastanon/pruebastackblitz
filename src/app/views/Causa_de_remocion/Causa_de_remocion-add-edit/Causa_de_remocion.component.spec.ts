import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Causa_de_remocionComponent } from './Causa_de_remocion.component';

describe('Causa_de_remocionComponent', () => {
  let component: Causa_de_remocionComponent;
  let fixture: ComponentFixture<Causa_de_remocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Causa_de_remocionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Causa_de_remocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

