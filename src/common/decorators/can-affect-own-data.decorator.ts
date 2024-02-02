import {createParamDecorator, ExecutionContext, SetMetadata} from "@nestjs/common";
import {createMethodDecorator} from "@nestjs/swagger/dist/decorators/helpers";
import {request} from "express";

export const PerformOwnData = () => SetMetadata('own',{
  user: request.user});