import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLayout_Estado_de_ResultadoComponent } from './list-Layout_Estado_de_Resultado.component';

describe('ListLayout_Estado_de_ResultadoComponent', () => {
  let component: ListLayout_Estado_de_ResultadoComponent;
  let fixture: ComponentFixture<ListLayout_Estado_de_ResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLayout_Estado_de_ResultadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLayout_Estado_de_ResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
