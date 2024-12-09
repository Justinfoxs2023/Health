import styled from 'styled-components';

interface GridProps {
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: number;
}

export const ResponsiveGrid = styled.div<GridProps>`
  display: grid;
  gap: ${({ theme, spacing = 2 }) => theme.spacing(spacing)};
  width: 100%;

  grid-template-columns: repeat(
    ${({ columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 } }) => columns.xs},
    1fr
  );

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(
      ${({ columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 } }) => columns.sm},
      1fr
    );
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(
      ${({ columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 } }) => columns.md},
      1fr
    );
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(
      ${({ columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 } }) => columns.lg},
      1fr
    );
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(
      ${({ columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 } }) => columns.xl},
      1fr
    );
  }
`; 