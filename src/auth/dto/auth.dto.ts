import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class Authdto {

    @IsEmail()
    @IsNotEmpty() //these are the validations that are prebuild in the class-validator package.
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}