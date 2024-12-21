import { ClientGrpc as NestClientGrpc } from '@nestjs/microservices';
import { GrpcOptions as NestGrpcOptions } from '@nestjs/microservices';
import { Observable as RxObservable } from 'rxjs';

export type GrpcOptionsType = NestGrpcOptions;
export type ClientGrpcType = NestClientGrpc;
export type ObservableType<T> = RxObservable<T>;
