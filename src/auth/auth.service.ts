import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2';
import { Authdto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable({})
export class AuthService{
    // test(){}
    constructor(private prisma : PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
        ){}
    
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
            
            // delete user.hash; //we are deleting this because password should not be shown.

            //return the saved user
            // return user;

            return this.signToken(user.id, user.email);
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

        // delete user.hash;
        // return user;
        return this.signToken(user.id, user.email); //here we are returning the user token instead of user details.
    }

    async signToken(userId : number, email: string): Promise<{ access_token: string }>{
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload,{
            expiresIn: '15m',
            secret: secret
        });

        return {
            access_token : token,
        }
        
    }
}