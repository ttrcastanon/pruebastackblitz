import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CMP_a_CotizarComponent } from './CMP_a_Cotizar.component';

describe('CMP_a_CotizarComponent', () => {
  let component: CMP_a_CotizarComponent;
  let fixture: ComponentFixture<CMP_a_CotizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CMP_a_CotizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMP_a_CotizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

