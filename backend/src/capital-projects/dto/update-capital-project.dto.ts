import { PartialType } from '@nestjs/swagger';
import { CreateCapitalProjectDto } from './create-capital-project.dto';

export class UpdateCapitalProjectDto extends PartialType(CreateCapitalProjectDto) {}