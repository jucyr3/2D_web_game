import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestMapTempDto } from './create-request-map-temp.dto';

export class UpdateRequestMapTempDto extends PartialType(CreateRequestMapTempDto) {}
