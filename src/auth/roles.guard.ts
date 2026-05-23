import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard
    implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean {
        const requiredRoles =
            this.reflector.getAllAndOverride<
                string[]
            >(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

        // ⭐ KHÔNG CÓ ROLE -> CHO QUA
        if (!requiredRoles) {
            return true;
        }

        const request =
            context
                .switchToHttp()
                .getRequest();

        const user = request.user;

        // ⭐ CHƯA LOGIN
        if (!user) {
            return false;
        }

        // ⭐ CHECK ROLE
        return requiredRoles.includes(
            user.role,
        );
    }
}