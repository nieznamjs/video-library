import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { HttpClientModule } from '@angular/common/http';

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
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    ...materialModules,
  ],
  exports: [
    ...materialModules,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    HeaderComponent,
  ]
})
export class SharedModule { }
