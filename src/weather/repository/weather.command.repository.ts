import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WeatherData } from './weather.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherCommandRepository {
  constructor(
    @InjectRepository(WeatherData)
    private readonly weatherDataRepository: Repository<WeatherData>,
  ) {}
  async create(data: any): Promise<WeatherData> {
    try {
      const weatherData = this.weatherDataRepository.create({
        lat: data.lat,
        lon: data.lon,
        data,
      });
      await this.weatherDataRepository.upsert(weatherData, ['lat', 'lon']);
      return weatherData;
    } catch (error) {
      throw new Error(`Failed to save weather data: ${error.message}`);
    }
  }
}
