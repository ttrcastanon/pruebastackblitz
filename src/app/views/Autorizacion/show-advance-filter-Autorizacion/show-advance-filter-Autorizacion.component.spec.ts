import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterAutorizacionComponent } from './show-advance-filter-Autorizacion.component';

describe('ShowAdvanceFilterAutorizacionComponent', () => {
  let component: ShowAdvanceFilterAutorizacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterAutorizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterAutorizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterAutorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
