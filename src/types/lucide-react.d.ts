declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
    color?: string;
  }

  export const Chrome: FC<IconProps>;
  export const Github: FC<IconProps>;
  export const Book: FC<IconProps>;
  export const Star: FC<IconProps>;
  export const Clock: FC<IconProps>;
}
