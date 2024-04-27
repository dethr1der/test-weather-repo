import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WeatherData } from './weather.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherQueryRepository {
  constructor(
    @InjectRepository(WeatherData)
    private readonly weatherDataRepository: Repository<WeatherData>,
  ) {}
  async findByLatLon(lat: number, lon: number): Promise<WeatherData> {
    try {
      return await this.weatherDataRepository.findOne({
        where: { lat, lon },
        order: {
          id: 'DESC',
        },
      });
    } catch (error) {
      throw new Error(`Failed to find weather data: ${error.message}`);
    }
  }
}
