import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColoresComponent } from './Colores.component';

describe('ColoresComponent', () => {
  let component: ColoresComponent;
  let fixture: ComponentFixture<ColoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

