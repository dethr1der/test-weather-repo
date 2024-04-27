import {
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
} from 'class-validator';
import { WeatherPart } from '../enums/part.enum';

export class FetchWeatherDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsEnum(WeatherPart, { each: true })
  part?: WeatherPart[];
}