// src/common/constants/messages.constant.ts

export const messagesConstant = {
    // User messages
    USER_NOT_FOUND: 'User not found.',
    USER_ALREADY_EXISTS: 'User already exists.',
    USER_FETCHED: 'User fetched successfully.',
    USERS_FETCHED: 'Users fetched successfully.',
    ADD_USER_RESPONSE: 'User created successfully.',
    USER_UPDATED: 'User updated successfully.',
    USER_DELETED: 'User deleted successfully.',
    UNAUTHORIZED_ACCESS: 'You are not authorized to perform this action.',
    UNAUTHORIZED_USER_UPDATE: 'You are not authorized to update this user',
    INVALID_CRED : 'Invalid credentials',

    // Auth messages
    INVALID_CREDENTIALS: 'Invalid email or password.',
    LOGIN_SUCCESS: 'Login successful.',
    LOGOUT_SUCCESS: 'Logout successful.',
    TOKEN_EXPIRED: 'Authentication token has expired.',
    PASSWORD_REQUIRED:'Password is required',
  
    // Role messages
    INVALID_ROLE_ID: 'Invalid role ID.',
    ROLES_FETCHED: 'Roles fetched successfully.',
    ROLE_NOT_FOUND: 'Role not found.',
    NOT_ALLOWED : 'You are not allowed to access this user.',
    ROLE_UPDATE_NOT_ALLOWED: 'Only admins can change user roles',

    // General
    FORBIDDEN: 'Access denied.',
    BAD_REQUEST: 'Bad request.',
    INTERNAL_SERVER_ERROR: 'Something went wrong, please try again later.',

    // blog 
    BLOG_UPDATED: 'Blog updated successfully',
    BLOG_DELETED: 'Blog deleted successfully',
  };
  