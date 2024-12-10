import styled from 'styled-components';
import { useField } from 'formik';

const FieldWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error.main : theme.colors.text.secondary};
  border-radius: 4px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error.main};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`;

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <FieldWrapper>
      <Label htmlFor={props.name}>{label}</Label>
      <Input 
        {...field} 
        {...props}
        hasError={hasError}
        aria-describedby={hasError ? `${props.name}-error` : undefined}
      />
      {hasError && (
        <ErrorMessage id={`${props.name}-error`} role="alert">
          {meta.error}
        </ErrorMessage>
      )}
    </FieldWrapper>
  );
}; 