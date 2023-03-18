import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartesComponent } from './Partes.component';

describe('PartesComponent', () => {
  let component: PartesComponent;
  let fixture: ComponentFixture<PartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

