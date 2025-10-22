import { PartialType } from '@nestjs/swagger';
import { CreateCapitalProjectPhaseDto } from './create-capital-project-phase.dto';

export class UpdateCapitalProjectPhaseDto extends PartialType(CreateCapitalProjectPhaseDto) {}