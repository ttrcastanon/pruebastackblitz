import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListControl_de_ComponentesComponent } from './list-Control_de_Componentes.component';

describe('ListControl_de_ComponentesComponent', () => {
  let component: ListControl_de_ComponentesComponent;
  let fixture: ComponentFixture<ListControl_de_ComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListControl_de_ComponentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListControl_de_ComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
