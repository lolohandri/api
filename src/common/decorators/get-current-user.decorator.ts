import {ExecutionContext, createParamDecorator, InternalServerErrorException} from "@nestjs/common";

export const GetCurrentUser = createParamDecorator(
    (data: string | undefined, context: ExecutionContext) => {
        const {user} = context.switchToHttp().getRequest();

        if(!user) throw new InternalServerErrorException(`${user} doesn't exist!`);
        if(data) return user[data];
        return user;


    },
);