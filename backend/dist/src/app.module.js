"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const students_module_1 = require("./students/students.module");
const teachers_module_1 = require("./teachers/teachers.module");
const classes_module_1 = require("./classes/classes.module");
const attendance_module_1 = require("./attendance/attendance.module");
const fees_module_1 = require("./fees/fees.module");
const library_module_1 = require("./library/library.module");
const transport_module_1 = require("./transport/transport.module");
const hostel_module_1 = require("./hostel/hostel.module");
const chat_module_1 = require("./chat/chat.module");
const notifications_module_1 = require("./notifications/notifications.module");
const analytics_module_1 = require("./analytics/analytics.module");
const settings_module_1 = require("./settings/settings.module");
const search_module_1 = require("./search/search.module");
const workspace_module_1 = require("./workspace/workspace.module");
const doubts_module_1 = require("./doubts/doubts.module");
const discussions_module_1 = require("./discussions/discussions.module");
const portfolio_module_1 = require("./portfolio/portfolio.module");
const gamification_module_1 = require("./gamification/gamification.module");
const diary_module_1 = require("./diary/diary.module");
const surveys_module_1 = require("./surveys/surveys.module");
const complaints_module_1 = require("./complaints/complaints.module");
const publications_module_1 = require("./publications/publications.module");
const events_module_1 = require("./events/events.module");
const lost_found_module_1 = require("./lost-found/lost-found.module");
const visitors_module_1 = require("./visitors/visitors.module");
const store_module_1 = require("./store/store.module");
const safety_module_1 = require("./safety/safety.module");
const sync_module_1 = require("./sync/sync.module");
const school_stats_module_1 = require("./school-stats/school-stats.module");
const exams_module_1 = require("./exams/exams.module");
const subjects_module_1 = require("./subjects/subjects.module");
const timetable_module_1 = require("./timetable/timetable.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            auth_module_1.AuthModule, users_module_1.UsersModule, students_module_1.StudentsModule, teachers_module_1.TeachersModule, classes_module_1.ClassesModule, attendance_module_1.AttendanceModule, fees_module_1.FeesModule, library_module_1.LibraryModule, transport_module_1.TransportModule, hostel_module_1.HostelModule, chat_module_1.ChatModule, notifications_module_1.NotificationsModule, analytics_module_1.AnalyticsModule, settings_module_1.SettingsModule, search_module_1.SearchModule, workspace_module_1.WorkspaceModule, doubts_module_1.DoubtsModule, discussions_module_1.DiscussionsModule, portfolio_module_1.PortfolioModule, gamification_module_1.GamificationModule, diary_module_1.DiaryModule, surveys_module_1.SurveysModule, complaints_module_1.ComplaintsModule, publications_module_1.PublicationsModule, events_module_1.EventsModule, lost_found_module_1.LostFoundModule, visitors_module_1.VisitorsModule, store_module_1.StoreModule, safety_module_1.SafetyModule, sync_module_1.SyncModule, school_stats_module_1.SchoolStatsModule, exams_module_1.ExamsModule, subjects_module_1.SubjectsModule, timetable_module_1.TimetableModule, dashboard_module_1.DashboardModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map