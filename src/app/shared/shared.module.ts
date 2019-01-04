import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import { HeaderComponent } from './components/header/header.component';

const materialModules = [
  MatPaginatorModule,
  MatIconModule,
  MatInputModule,
  MatToolbarModule,
  MatButtonModule,
  MatDividerModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatRadioModule,
  MatSnackBarModule,
];

@NgModule({
  declarations: [
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    ...materialModules,
  ],
  exports: [
    ...materialModules,
    HeaderComponent,
  ]
})
export class SharedModule { }
