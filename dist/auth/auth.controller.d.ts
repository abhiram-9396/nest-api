import { AuthService } from "./auth.service";
import { Authdto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: Authdto): Promise<import(".prisma/client").User>;
    signin(dto: Authdto): Promise<import(".prisma/client").User>;
}
