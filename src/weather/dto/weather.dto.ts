import { IsNumber, IsOptional } from 'class-validator';

class Temp {
  @IsNumber()
  @IsOptional()
  day: number;
  @IsNumber()
  @IsOptional()
  min: number;
  @IsNumber()
  @IsOptional()
  max: number;
  @IsNumber()
  @IsOptional()
  night: number;
  @IsNumber()
  @IsOptional()
  eve: number;
  @IsNumber()
  @IsOptional()
  morn: number;
}
class FeelsLike {
  @IsNumber()
  @IsOptional()
  day?: number;
  @IsNumber()
  @IsOptional()
  night?: number;
  @IsNumber()
  @IsOptional()
  eve: number;
  @IsNumber()
  @IsOptional()
  morn: number;
}
export class WeatherDto {
  @IsOptional()
  @IsNumber()
  sunrise?: number;

  @IsOptional()
  @IsNumber()
  sunset?: number;

  @IsOptional()
  temp?: number | Temp;

  @IsOptional()
  feels_like?: number | FeelsLike;

  @IsOptional()
  @IsNumber()
  pressure?: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsOptional()
  @IsNumber()
  uvi?: number;

  @IsOptional()
  @IsNumber()
  wind_speed?: number;

  @IsOptional()
  @IsNumber()
  dt?: number;

  @IsOptional()
  @IsNumber()
  precipitation?: number;
}
