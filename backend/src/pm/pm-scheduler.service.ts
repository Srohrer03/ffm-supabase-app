import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PMSchedulerService {
  private readonly logger = new Logger(PMSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async generateWorkOrdersFromPM() {
    this.logger.log('Starting daily PM work order generation...');

    try {
      // Find all pending occurrences that are due today or overdue
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      const dueOccurrences = await this.prisma.maintenanceOccurrence.findMany({
        where: {
          status: 'PENDING',
          scheduledDate: {
            lte: today,
          },
        },
        include: {
          template: {
            include: {
              site: true,
              area: true,
              asset: true,
              assignedTo: true,
            },
          },
        },
      });

      this.logger.log(`Found ${dueOccurrences.length} due PM occurrences`);

      for (const occurrence of dueOccurrences) {
        try {
          await this.generateWorkOrderFromOccurrence(occurrence);
        } catch (error) {
          this.logger.error(
            `Failed to generate work order for occurrence ${occurrence.id}: ${error.message}`,
          );
        }
      }

      this.logger.log('Daily PM work order generation completed');
    } catch (error) {
      this.logger.error(`PM scheduler error: ${error.message}`);
    }
  }

  private async generateWorkOrderFromOccurrence(occurrence: any) {
    const { template } = occurrence;

    // Create work order
    const workOrder = await this.prisma.workOrder.create({
      data: {
        title: `PM: ${template.title}`,
        description: `Preventive maintenance task: ${template.description || template.title}`,
        status: 'OPEN',
        priority: template.priority,
        siteId: template.siteId,
        areaId: template.areaId,
        assetId: template.assetId,
        requesterId: template.assignedToId || 'system', // Use system if no assignee
        assignedToId: template.assignedToId,
      },
    });

    // Update occurrence to link to work order
    await this.prisma.maintenanceOccurrence.update({
      where: { id: occurrence.id },
      data: {
        status: 'GENERATED',
        generatedWorkOrderId: workOrder.id,
      },
    });

    // Log the generation
    await this.auditService.log(
      'system',
      'PM_WORK_ORDER_GENERATED',
      'WORK_ORDER',
      workOrder.id,
    );

    this.logger.log(
      `Generated work order ${workOrder.id} from PM template ${template.id}`,
    );

    return workOrder;
  }

  // Method to handle work order completion and update occurrence
  async handleWorkOrderCompletion(workOrderId: string) {
    const occurrence = await this.prisma.maintenanceOccurrence.findFirst({
      where: {
        generatedWorkOrderId: workOrderId,
      },
    });

    if (occurrence && occurrence.status === 'GENERATED') {
      await this.prisma.maintenanceOccurrence.update({
        where: { id: occurrence.id },
        data: { status: 'COMPLETED' },
      });

      this.logger.log(
        `Marked PM occurrence ${occurrence.id} as completed for work order ${workOrderId}`,
      );
    }
  }
}