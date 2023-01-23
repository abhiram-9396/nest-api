"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtGaurd = void 0;
const passport_1 = require("@nestjs/passport");
class JwtGaurd extends (0, passport_1.AuthGuard)('jwt') {
    constructor() {
        super();
    }
}
exports.JwtGaurd = JwtGaurd;
//# sourceMappingURL=jwt.gaurd.js.map