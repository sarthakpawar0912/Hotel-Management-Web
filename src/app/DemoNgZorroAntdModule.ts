import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NzCardComponent, NzCardGridDirective, NzCardModule } from 'ng-zorro-antd/card';
import { ReactiveFormsModule } from '@angular/forms';  // Ensure correct import
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { en_US, NZ_I18N, NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTransButtonModule } from 'ng-zorro-antd/core/trans-button';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,   
    NzCardModule,
    HttpClientModule,
    CommonModule,
    NzButtonModule,
    NzTableModule
  ],
  providers:[{provide:NZ_I18N,useValue:en_US}],
 
  exports:[
   NzAffixModule,
   NzAlertModule,
   NzAnchorModule,
   NzAutocompleteModule,
   NzAvatarModule,
   NzBackTopModule,
   NzBadgeModule,
   NzButtonModule,
   NzBreadCrumbModule,
   NzCalendarModule,
   NzCardModule,
   NzCarouselModule,
   NzCascaderModule,
   NzCheckboxModule,
   NzCollapseModule,
   NzCommentModule,
   NzDatePickerModule,
   NzDescriptionsModule,
   NzDividerModule,
   NzDrawerModule,
   NzEmptyModule,
   NzFormModule,
   NzGridModule,
   NzI18nModule,
   NzIconModule,
   NzImageModule,
   NzInputModule,
   NzInputNumberModule,
   NzLayoutModule,
   NzListModule,
   NzMentionModule,
   NzMenuModule,
   NzMessageModule,
   NzModalModule,
   NzNoAnimationModule,NzNotificationModule,
   NzPageHeaderModule,
   NzPaginationModule,
   NzPopconfirmModule,
   NzPopoverModule,
   NzProgressModule,
   NzRadioModule,
   NzRateModule,
   NzResultModule,
   NzSelectModule,
   NzSkeletonModule,
   NzSliderModule,
   NzSpinModule,
   NzStatisticModule,
   NzStepsModule,
   NzSwitchModule,
   NzTableModule,
   NzTabsModule,
   NzTagModule,NzTimePickerModule,
   NzTimelineModule,
   NzToolTipModule,
   NzTransButtonModule,
   NzTransferModule,
   NzTreeModule,
   NzTreeViewModule,NzTreeSelectModule,
   NzTypographyModule,
   NzUploadModule,
   NzWaveModule,
   NzResizableModule,
   NzSegmentedModule,
   NzModalModule, NzCardComponent,
       NzCardModule,
       NzCardGridDirective,
       NzCardModule,
    NzButtonModule,
    NzGridModule,
    CommonModule,
    NzFormModule, 
    NzInputModule, 
    NzButtonModule,
    NzIconModule,
  ]
})
export class AppModule { }

@NgModule({

})
export class DemoNgZorroAntdModule{}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NzCardModule,RouterLink,
   RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
isClientLoggedIn: any;
isCompanyLoggedIn: any;
isAdminLoggedIn: any;
isCustomerLoggedIn: any;
logout() {
throw new Error('Method not implemented.');
}
  isCollapsed = false;

}
