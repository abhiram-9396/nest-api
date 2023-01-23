import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2';
import { Authdto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";


@Injectable({})
export class AuthService{
    // test(){}
    constructor(private prisma : PrismaService){}
    
    async signup(dto: Authdto) {
        //return the password hash
        const hash = await argon.hash(dto.password);
        //save the user in db

        try
        {
            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hash,
                },
                
                // select:
                // {
                //     email: true,
                //     createdAt: true,
                //     id: true,
                // } //only these are returned from the database.
            });
            
            delete user.hash; //we are deleting this because password should not be shown.

            //return the saved user
            return user;
        }
        catch(error)
        {
            if(error instanceof PrismaClientKnownRequestError)
            {
                if(error.code === 'P2002'){
                    throw new ForbiddenException('Credentials Exist!')
                }
                throw error
            }
        }
    }
    async signin(dto: Authdto){
        //find the user by email
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email,
            },
        });
        //if user do not exist thhrow an error
        if(!user) 
            throw new ForbiddenException('Credentials incorrect!');

        //compare the passwords
        const pwMatches = await argon.verify(user.hash, dto.password);

        if(!pwMatches) 
            throw new ForbiddenException('Password incorrect!');

        delete user.hash;
        return user;
    }
}