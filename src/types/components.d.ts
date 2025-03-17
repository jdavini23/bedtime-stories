declare module '@/components/common/Footer' {
  export interface FooterProps {
    className?: string;
  }

  export function Footer(props: FooterProps): JSX.Element;
  export default Footer;
}

declare module '@/components/common/*' {
  const component: any;
  export default component;
}
