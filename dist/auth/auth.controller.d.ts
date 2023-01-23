import { AuthService } from "./auth.service";
import { Authdto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: Authdto): Promise<{
        access_token: string;
    }>;
    signin(dto: Authdto): Promise<{
        access_token: string;
    }>;
}
