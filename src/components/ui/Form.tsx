import React from 'react';

import { theme } from '../../styles/theme';

interface IFormFieldProps {
  /** label 的描述 */
    label: string;
  /** error 的描述 */
    error: string;
  /** required 的描述 */
    required: false | true;
  /** children 的描述 */
    children: ReactReactNode;
}

export const FormField: React.FC<IFormFieldProps> = ({ label, error, required, children }) => {
  return (
    <div className="form-field">
      <label className="field-label">
        {label}
        {required && <span className="requiredmark"></span>}
      </label>
      <div className="fieldcontent">{children}</div>
      {error && <div className="fielderror">{error}</div>}

      <style jsx>{
        formfield {
          marginbottom {themespacing3}
        }

        fieldlabel {
          display block
          marginbottom {themespacing1}
          color {themecolorstextprimary}
          fontweight 500
        }

        requiredmark {
          color {themecolorserror}
          marginleft {themespacing05}
        }

        fielderror {
          margintop {themespacing05}
          color {themecolorserror}
          fontsize {themetypographybody2fontSize}
        }
      }</style>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** fullWidth 的描述 */
    fullWidth?: undefined | false | true;
}

export const Input: React.FC<InputProps> = ({ fullWidth = false, ...props }) => {
  return (
    <>
      <input className="input" {...props} />
      <style jsx>{
        input {
          padding {themespacing15} {themespacing2}
          border 1px solid rgba0 0 0 023
          borderradius {themeborderRadiussmall}
          fontsize {themetypographybody1fontSize}
          width {fullWidth  100  auto}
          transition bordercolor {themetransitionsshort}
        }

        inputhover {
          bordercolor rgba0 0 0 087
        }

        inputfocus {
          outline none
          bordercolor {themecolorsprimarymain}
          boxshadow 0 0 0 2px {themecolorsprimarylight}40
        }

        inputdisabled {
          background {themecolorsbackgrounddefault}
          color {themecolorstextdisabled}
          cursor notallowed
        }
      }</style>
    </>
  );
};

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** variant 的描述 */
    variant?: undefined | "contained" | "outlined" | "text";
  /** color 的描述 */
    color?: undefined | "primary" | "secondary";
  /** fullWidth 的描述 */
    fullWidth?: undefined | false | true;
}

export const Button: React.FC<IButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <>
      <button className={button {variant} {color}} {props}>
        {children}
      </button>
      <style jsx>{
        button {
          padding {themespacing15} {themespacing3}
          borderradius {themeborderRadiusmedium}
          fontsize {themetypographybody1fontSize}
          fontweight 500
          cursor pointer
          transition all {themetransitionsshort}
          width {fullWidth  100  auto}
        }

        buttoncontainedprimary {
          background {themecolorsprimarymain}
          color {themecolorsprimarycontrastText}
          border none
        }

        buttoncontainedsecondary {
          background {themecolorssecondarymain}
          color {themecolorssecondarycontrastText}
          border none
        }

        buttonoutlinedprimary {
          background transparent
          color {themecolorsprimarymain}
          border 1px solid {themecolorsprimarymain}
        }

        buttonoutlinedsecondary {
          background transparent
          color {themecolorssecondarymain}
          border 1px solid {themecolorssecondarymain}
        }

        buttontext {
          background transparent
          border none
          padding {themespacing1} {themespacing15}
        }

        buttontextprimary {
          color {themecolorsprimarymain}
        }

        buttontextsecondary {
          color {themecolorssecondarymain}
        }

        buttonhovernotdisabled {
          opacity 09
        }

        buttondisabled {
          opacity 05
          cursor notallowed
        }
      }</style>
    </>
  );
};
