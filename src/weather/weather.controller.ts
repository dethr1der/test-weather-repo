import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { FetchWeatherDto } from './dto/fetch-weather.dto';
import { ResponseInterceptor } from './interceptors/weather.interceptor';
import { WeatherPart } from './enums/part.enum';
import { WeatherData } from "./repository/weather.entity";

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/get-data')
  @Get()
  @UseInterceptors(ResponseInterceptor)
  async getWeatherData(
    @Query() query: { lat: number; lon: number; part: WeatherPart },
  ): Promise<any> {
    const { lat, lon } = query;
    const weatherData = await this.weatherService.getWeatherData(lat, lon);
    return weatherData;
  }

  @Post('/fetch-and-save')
  async fetchAndSaveWeatherData(
    @Body(ValidationPipe) fetchWeatherDto: FetchWeatherDto,
  ): Promise<WeatherData> {
    return await this.weatherService.fetchAndSaveWeatherData(fetchWeatherDto);
  }
}
