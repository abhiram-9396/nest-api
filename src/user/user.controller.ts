import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../../src/auth/decorators';
import { JwtGaurd } from '../../src/auth/gaurd';

@Controller('users')
export class UserController {

    @UseGuards(JwtGaurd) //here we are protecting the routes by using gaurds
    @Get('me')
    // getMe(@Req() req: Request)
    getMe(@GetUser() user: User)
    {
        // console.log({
        //     user: req.user,
        // })
        // return req.user;
        return user;
    }

    @Patch()
    editUser()
    {
        
    }

}
