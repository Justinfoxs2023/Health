export interface IAppError extends Error {
  status: number;
  code: string;
}

export interface IValidationError extends IAppError {
  details?: Array<{
    message: string;
    path: string[];
  }>;
}

export interface IAuthenticationError extends IAppError {}
export interface IAuthorizationError extends IAppError {}
export interface INotFoundError extends IAppError {}
export interface ISecurityError extends IAppError {} 