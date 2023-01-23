import { PrismaService } from "src/prisma/prisma.service";
import { Authdto } from "./dto";
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    signup(dto: Authdto): Promise<import(".prisma/client").User>;
    signin(dto: Authdto): Promise<import(".prisma/client").User>;
}
