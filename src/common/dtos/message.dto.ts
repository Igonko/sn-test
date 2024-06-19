import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ type: String, example: 'Example message' })
  message: string;
}
