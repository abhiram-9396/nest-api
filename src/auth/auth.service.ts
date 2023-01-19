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
            
            delete user.hash;

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
    signin(){
        return 'I am SignedIn!!'
    }
}