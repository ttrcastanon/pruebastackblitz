import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreSessionInactividadComponent } from './cierre-session-inactividad.component';

describe('CierreSessionInactividadComponent', () => {
  let component: CierreSessionInactividadComponent;
  let fixture: ComponentFixture<CierreSessionInactividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CierreSessionInactividadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CierreSessionInactividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
