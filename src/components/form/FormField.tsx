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
  border: 1px solid
    ${({ theme, hasError }) => (hasError ? theme.colors.error.main : theme.colors.text.secondary)};
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

interface IFormFieldProps {
  /** label 的描述 */
    label: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: string;
  /** placeholder 的描述 */
    placeholder: string;
}

export const FormField: React.FC<IFormFieldProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <FieldWrapper>
      <Label htmlFor={propsname}>{label}</Label>
      <Input
        {...field}
        {...props}
        hasError={hasError}
        aria-describedby={hasError ? `${props.name}-error` : undefined}
      />
      {hasError && (
        <ErrorMessage id={{propsname}error} role="alert">
          {metaerror}
        </ErrorMessage>
      )}
    </FieldWrapper>
  );
};
