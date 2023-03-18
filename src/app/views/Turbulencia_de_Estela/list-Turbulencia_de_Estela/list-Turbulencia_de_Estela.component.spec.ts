import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTurbulencia_de_EstelaComponent } from './list-Turbulencia_de_Estela.component';

describe('ListTurbulencia_de_EstelaComponent', () => {
  let component: ListTurbulencia_de_EstelaComponent;
  let fixture: ComponentFixture<ListTurbulencia_de_EstelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTurbulencia_de_EstelaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTurbulencia_de_EstelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
