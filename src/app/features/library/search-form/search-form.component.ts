import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../core/services/utils/helper.service';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from '../../../core/config/videos-type.config';
import { SearchService } from '../../../core/services/utils/search.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  providers: [
    { provide: YT_VIDEO_TYPE, useValue: 'xd' },
    { provide: VIMEO_VIDEO_TYPE, useValue: VIMEO_VIDEO_TYPE },
  ]
})
export class SearchFormComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private searchService: SearchService,
    @Inject(YT_VIDEO_TYPE) public ytVideoType: string,
    @Inject(VIMEO_VIDEO_TYPE) public vimeoVideoType: string,
  ) {}

  public ngOnInit(): void {
    this.form = this.createForm();
  }

  public onSubmit(): void {
    const id = this.helperService.extractId(this.form.value.id);
    const type = this.form.value.type;

    if (id.trim() === '') {
      return;
    }

    const foundVideo = this.searchService.getVideoById(id, type);
    console.log(foundVideo)
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: ['', Validators.required],
      type: [YT_VIDEO_TYPE],
    });
  }
}
