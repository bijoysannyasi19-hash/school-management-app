import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassesModule } from './classes/classes.module';
import { AttendanceModule } from './attendance/attendance.module';
import { FeesModule } from './fees/fees.module';
import { LibraryModule } from './library/library.module';
import { TransportModule } from './transport/transport.module';
import { HostelModule } from './hostel/hostel.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';
import { SearchModule } from './search/search.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { DoubtsModule } from './doubts/doubts.module';
import { DiscussionsModule } from './discussions/discussions.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { GamificationModule } from './gamification/gamification.module';
import { DiaryModule } from './diary/diary.module';
import { SurveysModule } from './surveys/surveys.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { PublicationsModule } from './publications/publications.module';
import { EventsModule } from './events/events.module';
import { LostFoundModule } from './lost-found/lost-found.module';
import { VisitorsModule } from './visitors/visitors.module';
import { StoreModule } from './store/store.module';
import { SafetyModule } from './safety/safety.module';
import { SyncModule } from './sync/sync.module';
import { SchoolStatsModule } from './school-stats/school-stats.module';
import { ExamsModule } from './exams/exams.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TimetableModule } from './timetable/timetable.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule, UsersModule, StudentsModule, TeachersModule, ClassesModule, AttendanceModule, FeesModule, LibraryModule, TransportModule, HostelModule, ChatModule, NotificationsModule, AnalyticsModule, SettingsModule, SearchModule, WorkspaceModule, DoubtsModule, DiscussionsModule, PortfolioModule, GamificationModule, DiaryModule, SurveysModule, ComplaintsModule, PublicationsModule, EventsModule, LostFoundModule, VisitorsModule, StoreModule, SafetyModule, SyncModule, SchoolStatsModule, ExamsModule, SubjectsModule, TimetableModule, DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
