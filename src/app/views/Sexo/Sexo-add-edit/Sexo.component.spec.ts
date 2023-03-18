import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SexoComponent } from './Sexo.component';

describe('SexoComponent', () => {
  let component: SexoComponent;
  let fixture: ComponentFixture<SexoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SexoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

