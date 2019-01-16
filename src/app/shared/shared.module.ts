import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
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
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule,
} from '@angular/material';

import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { SuccessSnackbarComponent } from './components/snackbars/success-snackbar/success-snackbar.component';
import { ErrorSnackbarComponent } from './components/snackbars/error-snackbar/error-snackbar.component';
import { VideoModalComponent } from './components/video-modal/video-modal.component';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from './constans/videos-types';

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
  MatSelectModule,
];

@NgModule({
  declarations: [
    HeaderComponent,
    SuccessSnackbarComponent,
    ErrorSnackbarComponent,
    VideoModalComponent,
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
    SuccessSnackbarComponent,
    ErrorSnackbarComponent,
    VideoModalComponent,
  ],
  entryComponents: [
    SuccessSnackbarComponent,
    ErrorSnackbarComponent,
    VideoModalComponent,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
      },
    },
      { provide: YT_VIDEO_TYPE, useValue: YT_VIDEO_TYPE },
      { provide: VIMEO_VIDEO_TYPE, useValue: VIMEO_VIDEO_TYPE },
    ],
})
export class SharedModule { }
