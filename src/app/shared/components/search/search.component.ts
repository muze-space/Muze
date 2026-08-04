import { Component, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { QUERY_PARAMS } from '../../../core/constants/query-params.const';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchForm = new FormGroup({
    query: new FormControl('', { nonNullable: true }),
  });

  private _router = inject(Router);

  constructor() {
    this.searchForm.controls.query.valueChanges
      .pipe(
        map((value) => value.trim()),
        debounceTime(1000),
        distinctUntilChanged(),
        filter((query) => !!query),
        takeUntilDestroyed(),
      )
      .subscribe((query) => this.navigateToSearch(query));
  }

  submitSearch(): void {
    const query = this.searchForm.controls.query.value.trim();

    if (!query) {
      return;
    }

    this.navigateToSearch(query);
  }

  private navigateToSearch(query: string): void {
    this._router.navigate([AppRoutes.Search], { queryParams: { [QUERY_PARAMS.query]: query } });
  }
}
