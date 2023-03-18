import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnoComponent } from './Ano.component';

describe('AnoComponent', () => {
  let component: AnoComponent;
  let fixture: ComponentFixture<AnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

