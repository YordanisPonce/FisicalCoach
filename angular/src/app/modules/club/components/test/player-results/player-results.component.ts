import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestService } from 'src/app/_services/test.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'app-player-results',
  templateUrl: './player-results.component.html',
  styleUrls: ['./player-results.component.scss'],
})
export class PlayerResultsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private testService: TestService,
    private msg: AlertsApiService
  ) {}

  loading: boolean = false;
  testResult: any;
  testId: any;
  subs = new Subscription();
  loadingSinglePDF: boolean = false;
  role: string = '';

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.testId = this.route.snapshot.paramMap.get('code');

    this.getTestApplication(this.testId);
  }

  /**
   * get application
   */
  getTestApplication(code: string): void {
    this.loading = true;
    this.subs = this.testService
      .getTestApplicationResult(code)
      .subscribe((res) => {
        this.testResult = res.data;

        this.loading = false;
      });
  }

  /**
   * download pdf report by id
   */
  downloadPdfById(id: number): void {
    this.loadingSinglePDF = true;

    this.testService.downloadReportById(id).subscribe(
      (res: any) => {
        const blob = new Blob([res as any], { type: 'application/pdf' });
        saveAs(
          blob,
          `${this.testResult?.applicant?.full_name}-test-report.pdf`
        );
        this.loadingSinglePDF = false;
      },
      ({ error }: any) => {
        this.msg.error(error);
        this.loadingSinglePDF = false;
      }
    );
  }

  /**
   * back to details
   */
  back(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
