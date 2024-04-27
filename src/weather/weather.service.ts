import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherCommandRepository } from './repository/weather.command.repository';
import { WeatherQueryRepository } from './repository/weather.query.repository';
import axios from 'axios';
import { FetchWeatherDto } from './dto/fetch-weather.dto';
import { WeatherPart } from './enums/part.enum';
import { CustomCircuitBreaker } from '../common/CustomCurcuitBreaker';
import { WeatherData } from './repository/weather.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class WeatherService {
  private readonly circuitBreaker: CustomCircuitBreaker;
  constructor(
    private readonly configService: ConfigService,
    private readonly weatherDataCommandRepository: WeatherCommandRepository,
    private readonly weatherDataQueryRepository: WeatherQueryRepository,
  ) {
    this.circuitBreaker = new CustomCircuitBreaker(10, 15000);
  }

  private async fetchWeatherData(
    lat: number,
    lon: number,
    part?: WeatherPart[],
  ): Promise<any> {
    const apiKey = this.configService.get('OPENWEATHERMAP_API_KEY');
    let url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    if (part) {
      url += `&exclude=${part.join(',')}`;
    }
    try {
      const response = await this.circuitBreaker.execute(async () => {
        const response = await axios.get(url);
        return response.data;
      });

      return response;
    } catch (error) {
      Logger.error('Fetching error', error);
      throw new HttpException(
        'Service temporary unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  public async fetchAndSaveWeatherData(
    fetchWeatherDto: FetchWeatherDto,
  ): Promise<WeatherData> {
    const { lat, lon, part } = fetchWeatherDto;
    const weatherData = await this.fetchWeatherData(lat, lon, part);
    return await this.saveWeatherData(weatherData);
  }

  private async saveWeatherData(data: any): Promise<WeatherData> {
    try {
      return await this.weatherDataCommandRepository.create(data);
    } catch (error) {
      Logger.error('Saving to the database is not available', error);
      throw new HttpException(
        'Service temporary unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  public async getWeatherData(lat: number, lon: number): Promise<any> {
    try {
      return await this.weatherDataQueryRepository.findByLatLon(lat, lon);
    } catch (error) {
      Logger.warn(
        'Unfortunately data is not available or does not exist',
        error,
      );
      throw new HttpException(
        '404 Weather does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
