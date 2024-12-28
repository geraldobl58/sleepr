import { IsEmpty, IsString } from 'class-validator';

export class GetUsertDto {
  @IsString()
  @IsEmpty()
  _id: string;
}
