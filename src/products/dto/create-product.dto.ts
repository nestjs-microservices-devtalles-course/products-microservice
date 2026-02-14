import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsNumber(
    {
      maxDecimalPlaces: 4,
    },
    {
      message: 'Price must be a number with 4 decimal places as maximum',
    },
  )
  @Min(0)
  @Type(() => Number)
  public price: number;
}
