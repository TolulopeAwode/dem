import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ServiceResponseDto } from '../dto/response.dto';


@Injectable()
export class ResponseTransformerIntersector implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(map(data => {
        var result = new ServiceResponseDto()
        result.data = data;
        result.responseCode = 200;
        result.responseMessage = "Successful"
        console.log(result);
        return result;
      }))
  }

}