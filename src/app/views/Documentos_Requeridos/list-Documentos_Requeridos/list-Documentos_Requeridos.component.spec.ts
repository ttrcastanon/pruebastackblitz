import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDocumentos_RequeridosComponent } from './list-Documentos_Requeridos.component';

describe('ListDocumentos_RequeridosComponent', () => {
  let component: ListDocumentos_RequeridosComponent;
  let fixture: ComponentFixture<ListDocumentos_RequeridosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDocumentos_RequeridosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDocumentos_RequeridosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
