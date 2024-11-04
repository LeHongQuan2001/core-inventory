import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {User} from 'src/app/models/user.model';
import {AuthenticationService} from 'src/app/services/authenticate.service';
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../../environments/environment";
import {DatePipe} from '@angular/common';
import * as moment from "moment";
import {ActivatedRoute} from '@angular/router';
import {Subject} from "rxjs/internal/Subject";
import {RouterService} from "../../services/router.service";
import {UtilsService} from "../../services/utils.service";

declare const $: any;

@Component({
    selector: 'app-base',
    template: ''
})
export class BaseComponent implements OnInit, OnDestroy {

    titleService!: Title;
    originalUser: any;
    currentUser!: User | null;

    language: any;
    languages = environment.locale.list;

    userLoginInfo = new Subject<any>();

    startDate: Date = new Date((new Date()).getTime() - (6 * 24 * 60 * 60 * 1000));
    endDate: Date = new Date();
    datePipe: DatePipe = new DatePipe('en-US');

    environment = environment;

    fromDate: any;
    toDate: any;
    onApplyDate = new Subject<any>();
    datePickerInstance: any;
    picker: any;
    routerService = new RouterService();
    private boundCloseDatePicker: () => void;
    localeKey = environment.appPrefix + 'locale';

    constructor(public authenticationService: AuthenticationService,
                public activatedRoute: ActivatedRoute,
                public translate: TranslateService) {
        // this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
        //     this.currentUser = user;
        // });

        this.currentUser = this.authenticationService.getUserFromLocalStorage();
        this.originalUser = this.authenticationService.getUserOriginalFromLocalStorage();
        this.boundCloseDatePicker = this.closeDatePicker.bind(this);
        this.activatedRoute.queryParams.subscribe((params: any) => {
            const dateRegex = new RegExp(/([\d]{4})\-([\d]{1,2})\-([0-9]{1,2})/i);
            if (typeof (params.fd) !== 'undefined' && dateRegex.test(params.fd)) {
                this.startDate = new Date(params.fd);
            }
            if (typeof (params.td) !== 'undefined' && dateRegex.test(params.td)) {
                this.endDate = new Date(params.td);
            } else {
                this.endDate = new Date();
            }
        });
    }

    ngOnInit() {
        this.initLanguage();
    }

    ngOnDestroy() {
    }

    initLanguage() {
        const lang = localStorage.getItem(this.localeKey) ?? 'vi';
        this.translate.use(lang)
        this.language = this.translate.currentLang;
    }

    public setTitle(title: string) {
        this.titleService.setTitle(title);
    }

    getApp() {
        window.location.reload();
    }

    changeLang(lang: string) {
        this.language = lang;
        localStorage.setItem(this.localeKey, this.language);
        this.translate.use(lang).subscribe(result => {
            window.location.reload();
        });
    }

    setToken(data: any) {
        this.userLoginInfo.next(data);
    }

    initDatePicker(open: string = 'left', ranges: boolean = true, isMobile = false) {
        const translate = this.translate;
        const daysOfWeek = [
            translate.instant('common.datePicker.days.sunday'),
            translate.instant('common.datePicker.days.monday'),
            translate.instant('common.datePicker.days.tuesday'),
            translate.instant('common.datePicker.days.wednesday'),
            translate.instant('common.datePicker.days.thursday'),
            translate.instant('common.datePicker.days.friday'),
            translate.instant('common.datePicker.days.saturday')
        ];
        const months = [
            translate.instant('common.datePicker.months.january'),
            translate.instant('common.datePicker.months.february'),
            translate.instant('common.datePicker.months.march'),
            translate.instant('common.datePicker.months.april'),
            translate.instant('common.datePicker.months.may'),
            translate.instant('common.datePicker.months.june'),
            translate.instant('common.datePicker.months.july'),
            translate.instant('common.datePicker.months.august'),
            translate.instant('common.datePicker.months.september'),
            translate.instant('common.datePicker.months.october'),
            translate.instant('common.datePicker.months.november'),
            translate.instant('common.datePicker.months.december')
        ];
        const options = {
            locale: {
                format: 'DD/MM/YYYY',
                applyLabel: translate.instant('common.datePicker.applyLabel'),
                cancelLabel: translate.instant('common.datePicker.cancelLabel'),
                startLabel: 'startLabel',
                endLabel: 'endLabel',
                customRangeLabel: translate.instant('common.datePicker.customRangeLabel'),
                daysOfWeek: daysOfWeek,
                monthNames: months,
                firstDay: 1
            },
            useCurrent: true,
            //timePicker: true,
            //timePicker24Hour: true,
            alwaysShowCalendars: true,
            showDropdowns: true,
            linkedCalendars: false,
            startDate: moment(this.startDate),
            endDate: moment(this.endDate),
            opens: open, // double check this !!!!!!!!!!!!!!!!!!!!!!
            parentEl: '.content-inner',
            standalone: false
        };

        if (ranges) {
            // @ts-ignore
            options.ranges = {};
            // @ts-ignore
            options.ranges[translate.instant('common.datePicker.today')] = [moment(), moment()];
            // @ts-ignore
            options.ranges[translate.instant('common.datePicker.yesterday')] = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
            // @ts-ignore
            options.ranges[translate.instant('common.datePicker.7daysAgo')] = [moment().subtract(6, 'days'), moment()];
            // @ts-ignore
            options.ranges[translate.instant('common.datePicker.30daysAgo')] = [moment().subtract(29, 'days'), moment()];
            // @ts-ignore
            options.ranges[translate.instant('common.datePicker.thisMonth')] = [moment().startOf('month'), moment().endOf('month')];
            // @ts-ignore
            options.ranges[translate.instant('common.datePicker.lastMonth')] = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];
        }

        this.datePickerInstance = $('.date-range-picker').daterangepicker(options, (start: any, end: any) => {
            $('.date-range-picker').html(start.format('DD/MM/YYYY') + ' &nbsp; - &nbsp; ' + end.format('DD/MM/YYYY'));
            this.startDate = start.format('YYYY-MM-DD');
            this.endDate = end.format('YYYY-MM-DD');
            this.fromDate = start.format('YYYY-MM-DD');
            this.toDate = end.format('YYYY-MM-DD');
            this.onApplyDate?.next(true)
        }).on('show.daterangepicker', (ev: any, picker: any) => {
            this.picker = picker;
            const element = $(picker.element).parents('button');
            const screenWidth = $(window).width();
            const screenHeight = $(window).height();
            const offset = element.offset();
            const width = element.outerWidth();
            const heightPicker = isMobile ? 355 : 412;
            if (isMobile) {
                $(picker.container).css({
                    'max-height': `${350}px`,
                    'overflow': 'auto'
                });
            }
            switch (open) {
                case 'right':
                    $(picker.container).css({
                        top: offset.top + 40 - 2,
                        left: offset.left
                    });
                    break;
                case 'left':
                    $(picker.container).css({
                        top: screenHeight - offset.top - 60 < heightPicker ? offset.top - heightPicker : offset.top + 40 - 2,
                        right: screenWidth - (offset.left + width)
                    });
                    break;
            }
        }).on('showCalendar.daterangepicker', (ev: any, picker: any) => {
            const element = $(picker.element).parents('button');
            const screenWidth = $(window).width();
            const screenHeight = $(window).height();
            const offset = element.offset();
            const width = element.outerWidth();
            switch (open) {
                case 'right':
                    $(picker.container).css({
                        top: offset.top + 40 - 2,
                        left: offset.left
                    });
                    break;
                case 'left':
                    $(picker.container).css({
                        top: screenHeight - offset.top - 60 < 410 ? offset.top - 412 : offset.top + 40 - 2,
                        right: screenWidth - (offset.left + width)
                    });
                    break;
            }
            if (isMobile) {
                $(picker.container).css({
                    'max-height': `${350}px`,
                    'overflow': 'auto',
                    'z-index': `99999`,
                    '-webkit-overflow-scrolling': `auto`
                });
            }
        })

        // Close date picker when scroll
        const all = document.querySelectorAll('.content-inner');
        if (all.length > 0) {
            all.forEach(e => {
                e.addEventListener('scroll', this.boundCloseDatePicker)
            })
        }

        // Display date format
        $('.date-range-picker span').html(moment(this.startDate).format('DD/MM/YYYY') + ' &nbsp; - &nbsp; ' + moment(this.endDate).format('DD/MM/YYYY'));
    }

    destroyDatePicker(instance: any) {
        let elements = document.querySelectorAll('.content-inner');
        if (elements.length > 0) {
            elements.forEach(e => {
                e.removeEventListener('scroll', this.boundCloseDatePicker)
            })
        }
        if (instance) {
            instance.remove();
        }
    }

    closeDatePicker() {
        if (this.picker && this.picker.isShowing) {
            this.picker.hide();
        }
    }

    initDatePickerNotRanges() {
        const translate = this.translate;
        const daysOfWeek = [
            translate.instant('common.datePicker.days.sunday'),
            translate.instant('common.datePicker.days.monday'),
            translate.instant('common.datePicker.days.tuesday'),
            translate.instant('common.datePicker.days.wednesday'),
            translate.instant('common.datePicker.days.thursday'),
            translate.instant('common.datePicker.days.friday'),
            translate.instant('common.datePicker.days.saturday')
        ];
        const months = [
            translate.instant('common.datePicker.months.january'),
            translate.instant('common.datePicker.months.february'),
            translate.instant('common.datePicker.months.march'),
            translate.instant('common.datePicker.months.april'),
            translate.instant('common.datePicker.months.may'),
            translate.instant('common.datePicker.months.june'),
            translate.instant('common.datePicker.months.july'),
            translate.instant('common.datePicker.months.august'),
            translate.instant('common.datePicker.months.september'),
            translate.instant('common.datePicker.months.october'),
            translate.instant('common.datePicker.months.november'),
            translate.instant('common.datePicker.months.december')
        ];
        const options = {
            locale: {
                format: 'YYYY-MM-DD hh:mm',
                applyLabel: translate.instant("common.datePicker.applyLabel"),
                cancelLabel: translate.instant("common.datePicker.cancelLabel"),
                daysOfWeek: daysOfWeek,
                monthNames: months
            },
            alwaysShowCalendars: true,
            showDropdowns: true,
            linkedCalendars: false,
            singleDatePicker: true,
            timePicker: true,
            allowSelectTime: true,
            timePicker24Hour: true,
            minDate: moment().format('YYYY-MM-DD HH:mm'),
            opens: 'center',
            drops: 'auto'
        }
        return options;
    }

    initDatePickerCustom(timePicker = true, minDate = null, startDate = null) {
        const translate = this.translate;
        const daysOfWeek = [
            translate.instant('common.datePicker.days.sunday'),
            translate.instant('common.datePicker.days.monday'),
            translate.instant('common.datePicker.days.tuesday'),
            translate.instant('common.datePicker.days.wednesday'),
            translate.instant('common.datePicker.days.thursday'),
            translate.instant('common.datePicker.days.friday'),
            translate.instant('common.datePicker.days.saturday')
        ];
        const months = [
            translate.instant('common.datePicker.months.january'),
            translate.instant('common.datePicker.months.february'),
            translate.instant('common.datePicker.months.march'),
            translate.instant('common.datePicker.months.april'),
            translate.instant('common.datePicker.months.may'),
            translate.instant('common.datePicker.months.june'),
            translate.instant('common.datePicker.months.july'),
            translate.instant('common.datePicker.months.august'),
            translate.instant('common.datePicker.months.september'),
            translate.instant('common.datePicker.months.october'),
            translate.instant('common.datePicker.months.november'),
            translate.instant('common.datePicker.months.december')
        ];
        const options = {
            locale: {
                format: 'YYYY-MM-DD hh:mm:ss',
                applyLabel: translate.instant("common.datePicker.applyLabel"),
                cancelLabel: translate.instant("common.datePicker.cancelLabel"),
                daysOfWeek: daysOfWeek,
                monthNames: months
            },
            alwaysShowCalendars: true,
            showDropdowns: true,
            linkedCalendars: false,
            singleDatePicker: true,
            timePicker: timePicker,
            minDate: minDate ? moment(minDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            opens: 'center',
            drops: 'auto'
        }
        if (startDate) {
            // @ts-ignore
            options.startDate = moment(startDate).format('YYYY-MM-DD');
        }
        return options;
    }
}
