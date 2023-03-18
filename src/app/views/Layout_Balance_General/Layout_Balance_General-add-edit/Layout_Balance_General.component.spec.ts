import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout_Balance_GeneralComponent } from './Layout_Balance_General.component';

describe('Layout_Balance_GeneralComponent', () => {
  let component: Layout_Balance_GeneralComponent;
  let fixture: ComponentFixture<Layout_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Layout_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Layout_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

