import { Injectable } from '@nestjs/common';
import { CreateRequestMapTempDto } from './dto/create-request-map-temp.dto';
import { UpdateRequestMapTempDto } from './dto/update-request-map-temp.dto';

@Injectable()
export class RequestMapTempService {
  create(createRequestMapTempDto: CreateRequestMapTempDto) {
    return 'This action adds a new requestMapTemp';
  }

  findAll() {
    return `This action returns all requestMapTemp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestMapTemp`;
  }

  update(id: number, updateRequestMapTempDto: UpdateRequestMapTempDto) {
    return `This action updates a #${id} requestMapTemp`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestMapTemp`;
  }
}
