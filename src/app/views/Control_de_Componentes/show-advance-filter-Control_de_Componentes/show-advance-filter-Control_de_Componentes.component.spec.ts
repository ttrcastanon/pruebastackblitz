import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterControl_de_ComponentesComponent } from './show-advance-filter-Control_de_Componentes.component';

describe('ShowAdvanceFilterControl_de_ComponentesComponent', () => {
  let component: ShowAdvanceFilterControl_de_ComponentesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterControl_de_ComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterControl_de_ComponentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterControl_de_ComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
