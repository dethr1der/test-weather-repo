import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { WeatherDto } from '../dto/weather.dto';
import { validate } from 'class-validator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const part = request.query.part;
    return next.handle().pipe(
      map(async (data) => {
        if (data === null) {
          return {};
        }
        if (part === 'current') {
          const transformedData = plainToClass(WeatherDto, {
            sunrise: data.data[part]?.sunrise,
            sunset: data.data[part]?.sunset,
            temp: data.data[part]?.temp,
            feels_like: data.data[part]?.feels_like,
            pressure: data.data[part]?.pressure,
            humidity: data.data[part]?.humidity,
            uvi: data.data[part]?.uvi,
            wind_speed: data.data[part]?.wind_speed,
          });

          const errors = await validate(transformedData);
          if (errors.length > 0) {
            throw new HttpException(
              'Validation Error Bad Data',
              HttpStatus.BAD_REQUEST,
            );
          }

          return transformedData;
        }
        const arrayOfValues = data.data[part];
        if (Array.isArray(arrayOfValues)) {
          const transformedArray = arrayOfValues.map((item) => {
            return plainToClass(WeatherDto, {
              sunrise: item.sunrise,
              sunset: item.sunset,
              temp: item.temp,
              feels_like: item.feels_like,
              pressure: item.pressure,
              humidity: item.humidity,
              uvi: item.uvi,
              wind_speed: item.wind_speed,
              dt: item.dt,
              precipitation: item.precipitation,
            });
          });

          const errors = await Promise.all(
            transformedArray.map((item) => validate(item)),
          );
          if (errors.some((err) => err.length > 0)) {
            throw new HttpException(
              'Validation Error Bad Data',
              HttpStatus.BAD_REQUEST,
            );
          }

          return transformedArray;
        }
      }),
    );
  }
}
