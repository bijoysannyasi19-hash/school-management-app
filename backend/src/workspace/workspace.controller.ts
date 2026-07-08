import { Controller, Get, Post, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
  }),
};

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post()
  createWorkspace(@Body() body: { classId: string; name: string; description?: string }) {
    return this.workspaceService.createWorkspace(body.classId, body.name, body.description);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT)
  @Get('class/:classId')
  getWorkspaceByClass(@Param('classId') classId: string) {
    // Note: In a real app, verify the user has access to this class.
    return this.workspaceService.getWorkspaceByClass(classId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT)
  @Post(':workspaceId/post')
  createPost(
    @Request() req,
    @Param('workspaceId') workspaceId: string, 
    @Body() body: { content: string; isPinned?: boolean }
  ) {
    return this.workspaceService.createPost(workspaceId, req.user.userId, body.content, body.isPinned);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post(':workspaceId/assignment')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  createAssignment(
    @Param('workspaceId') workspaceId: string, 
    @Body() body: { title: string; description: string; dueDate: string; attachmentUrl?: string },
    @UploadedFile() file?: Express.Multer.File
  ) {
    const finalAttachmentUrl = file ? `/uploads/${file.filename}` : body.attachmentUrl;
    return this.workspaceService.createAssignment(workspaceId, body.title, body.description, new Date(body.dueDate), finalAttachmentUrl);
  }

  @Roles(Role.STUDENT)
  @Post('assignment/:id/submit')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  submitAssignment(
    @Request() req,
    @Param('id') assignmentId: string,
    @Body() body: { fileUrl?: string },
    @UploadedFile() file?: Express.Multer.File
  ) {
    const finalFileUrl = file ? `/uploads/${file.filename}` : body.fileUrl;
    if (!finalFileUrl) {
      throw new Error('A file or URL must be provided');
    }
    return this.workspaceService.submitAssignment(assignmentId, req.user.userId, finalFileUrl);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Get('assignment/:id/submissions')
  getSubmissions(@Param('id') assignmentId: string) {
    return this.workspaceService.getSubmissions(assignmentId);
  }
}
