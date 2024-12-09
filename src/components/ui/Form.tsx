import React from 'react';
import { theme } from '../../styles/theme';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children
}) => {
  return (
    <div className="form-field">
      <label className="field-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <div className="field-content">{children}</div>
      {error && <div className="field-error">{error}</div>}

      <style jsx>{`
        .form-field {
          margin-bottom: ${theme.spacing(3)};
        }

        .field-label {
          display: block;
          margin-bottom: ${theme.spacing(1)};
          color: ${theme.colors.text.primary};
          font-weight: 500;
        }

        .required-mark {
          color: ${theme.colors.error};
          margin-left: ${theme.spacing(0.5)};
        }

        .field-error {
          margin-top: ${theme.spacing(0.5)};
          color: ${theme.colors.error};
          font-size: ${theme.typography.body2.fontSize};
        }
      `}</style>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({ fullWidth = false, ...props }) => {
  return (
    <>
      <input className="input" {...props} />
      <style jsx>{`
        .input {
          padding: ${theme.spacing(1.5)} ${theme.spacing(2)};
          border: 1px solid rgba(0, 0, 0, 0.23);
          border-radius: ${theme.borderRadius.small};
          font-size: ${theme.typography.body1.fontSize};
          width: ${fullWidth ? '100%' : 'auto'};
          transition: border-color ${theme.transitions.short};
        }

        .input:hover {
          border-color: rgba(0, 0, 0, 0.87);
        }

        .input:focus {
          outline: none;
          border-color: ${theme.colors.primary.main};
          box-shadow: 0 0 0 2px ${theme.colors.primary.light}40;
        }

        .input:disabled {
          background: ${theme.colors.background.default};
          color: ${theme.colors.text.disabled};
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <>
      <button className={`button ${variant} ${color}`} {...props}>
        {children}
      </button>
      <style jsx>{`
        .button {
          padding: ${theme.spacing(1.5)} ${theme.spacing(3)};
          border-radius: ${theme.borderRadius.medium};
          font-size: ${theme.typography.body1.fontSize};
          font-weight: 500;
          cursor: pointer;
          transition: all ${theme.transitions.short};
          width: ${fullWidth ? '100%' : 'auto'};
        }

        .button.contained.primary {
          background: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrastText};
          border: none;
        }

        .button.contained.secondary {
          background: ${theme.colors.secondary.main};
          color: ${theme.colors.secondary.contrastText};
          border: none;
        }

        .button.outlined.primary {
          background: transparent;
          color: ${theme.colors.primary.main};
          border: 1px solid ${theme.colors.primary.main};
        }

        .button.outlined.secondary {
          background: transparent;
          color: ${theme.colors.secondary.main};
          border: 1px solid ${theme.colors.secondary.main};
        }

        .button.text {
          background: transparent;
          border: none;
          padding: ${theme.spacing(1)} ${theme.spacing(1.5)};
        }

        .button.text.primary {
          color: ${theme.colors.primary.main};
        }

        .button.text.secondary {
          color: ${theme.colors.secondary.main};
        }

        .button:hover:not(:disabled) {
          opacity: 0.9;
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}; 