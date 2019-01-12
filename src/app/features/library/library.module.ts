import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryComponent } from './library.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { ResultsOptionsComponent } from './results-options/results-options.component';
import { SharedModule } from '../../shared/shared.module';
import { VideosListComponent } from './videos-list/videos-list.component';
import { VideoItemComponent } from './video-item/video-item.component';
import { ChooseVideoModalComponent } from './choose-video-modal/choose-video-modal.component';

@NgModule({
  declarations: [
    LibraryComponent,
    SearchFormComponent,
    ResultsOptionsComponent,
    VideosListComponent,
    VideoItemComponent,
    ChooseVideoModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    LibraryComponent,
  ],
  entryComponents: [
    ChooseVideoModalComponent,
  ],
})
export class LibraryModule { }
