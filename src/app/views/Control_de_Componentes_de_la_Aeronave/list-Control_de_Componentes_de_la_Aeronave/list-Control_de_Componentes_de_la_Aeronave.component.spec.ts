import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListControl_de_Componentes_de_la_AeronaveComponent } from './list-Control_de_Componentes_de_la_Aeronave.component';

describe('ListControl_de_Componentes_de_la_AeronaveComponent', () => {
  let component: ListControl_de_Componentes_de_la_AeronaveComponent;
  let fixture: ComponentFixture<ListControl_de_Componentes_de_la_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListControl_de_Componentes_de_la_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListControl_de_Componentes_de_la_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
