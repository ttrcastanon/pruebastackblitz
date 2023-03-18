import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesPermissionsComponent } from './modules-permissions.component';

describe('ModulesPermissionsComponent', () => {
  let component: ModulesPermissionsComponent;
  let fixture: ComponentFixture<ModulesPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulesPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
