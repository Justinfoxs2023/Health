import { Observable as RxObservable } from 'rxjs';
import { GrpcOptions as NestGrpcOptions } from '@nestjs/microservices';
import { ClientGrpc as NestClientGrpc } from '@nestjs/microservices';

export type GrpcOptions = NestGrpcOptions;
export type ClientGrpc = NestClientGrpc;
export type Observable<T> = RxObservable<T>; 