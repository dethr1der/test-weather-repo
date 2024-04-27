import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherCommandRepository } from './repository/weather.command.repository';
import { WeatherQueryRepository } from './repository/weather.query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherData } from './repository/weather.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherData])],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherCommandRepository, WeatherQueryRepository],
})
export class WeatherModule {}
