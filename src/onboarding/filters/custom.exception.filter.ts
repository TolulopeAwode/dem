import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";
import { HttpException, ArgumentsHost, InternalServerErrorException, Catch, BadRequestException } from "@nestjs/common";
import { ServiceResponseDto } from "../dto/response.dto";
import { CustomException } from "../exceptions/custom.exception";


@Catch()
export class CustomExceptionFilter implements BaseRpcExceptionFilter {
    catch(exception: any, host: ArgumentsHost): Observable<any> {
        var result: ServiceResponseDto = new ServiceResponseDto();
        result.responseCode = 400;
        if (exception instanceof HttpException) {
            var exResponse = <any>exception.getResponse();
            console.log(exResponse);

            if (Array.isArray(exResponse.message)) {
                result.responseMessage = exResponse.message[0]
            }
            else {
                result.responseMessage = exResponse.message;
            }
        } else if (exception instanceof CustomException) {
            result.responseMessage = exception.message
        } else {
            result.responseMessage = "Server error. Please try again."
        }
        console.log(result);

        return new Observable((observer) => {
            observer.next(result)
            observer.complete()
        })

    }
    handleUnknownError(exception: any, status: string): Observable<never> {
        throw new Error("Method not implemented.");
    }
    isError(exception: any): exception is Error {
        throw new Error("Method not implemented.");
    }
}