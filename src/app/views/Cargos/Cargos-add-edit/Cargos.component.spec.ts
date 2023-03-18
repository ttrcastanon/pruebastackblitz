import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CargosComponent } from './Cargos.component';

describe('CargosComponent', () => {
  let component: CargosComponent;
  let fixture: ComponentFixture<CargosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

