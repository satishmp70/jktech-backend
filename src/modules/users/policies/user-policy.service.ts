import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { messagesConstant } from '../../../common/constants/messages.constant';

@Injectable()
export class UserPolicyService {
  validateUpdateAccess(
    currentUser: { id: number; role: string },
    targetUserId: number,
    updateDto: UpdateUserDto,
  ): void {
    
    const isAdmin = currentUser.role?.toUpperCase() === 'ADMIN';
    
    if (isAdmin) {
      return;
    }

    if (currentUser.id !== targetUserId) {
      throw new ForbiddenException(messagesConstant.UNAUTHORIZED_USER_UPDATE);
    }

    if (updateDto.roleId) {
      throw new ForbiddenException(messagesConstant.ROLE_UPDATE_NOT_ALLOWED);
    }
  }
}
