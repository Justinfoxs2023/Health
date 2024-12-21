import { ClientGrpc as NestClientGrpc } from '@nestjs/microservices';
import { GrpcOptions as NestGrpcOptions } from '@nestjs/microservices';
import { Observable as RxObservable } from 'rxjs';

export type GrpcOptionsType = GrpcOptions;
export type ClientGrpcType = ClientGrpc;
export type ObservableType<T> = any;
