import { Body, Controller, Post, Req } from "@nestjs/common";
// import { Request } from "express";
import { AuthService } from "./auth.service";
import { Authdto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}
        // this.authService.test(); //calling the test function from the auth.service.ts this is called dependency injection
    
        @Post('signup')
        // signup(@Req() req: Request ){
        //     console.log(req.body);
        //     return this.authService.signup()
        // }        //instead of this we can obtain the request as below

        // signup(@Body('email') email: string, @Body('password') password: string ){
        //     console.log({
        //         email,
        //         TypeOfEmail : typeof email,
        //         password,
        //         TypeOfPassword : typeof password,
        //     });
        //     return this.authService.signup()
        // }

        signup(@Body() dto: Authdto ){
            // console.log(dto);
            return this.authService.signup(dto)
        }

        @Post('signin')
        signin(){
            return this.authService.signin()
        }

}