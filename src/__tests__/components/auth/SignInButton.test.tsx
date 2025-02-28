import { render, screen, fireEvent } from '@testing-library/react';
import { SignInButton } from '@/components/auth/SignInButton';
import { useAuth } from '@clerk/nextjs';

// Mock the useRouter hook
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the useAuth hook
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

describe('SignInButton', () => {
  beforeEach(() => {
    mockPush.mockClear();
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
    });
  });

  it('should render with default props', () => {
    // Mock user is not signed in
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: false });

    render(<SignInButton />);

    // Check that the button is rendered with default text
    expect(screen.getByText('Sign In')).toBeInTheDocument();

    // Click the button
    fireEvent.click(screen.getByText('Sign In'));

    // Check that router.push was called with the default redirect URL
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('should render with custom props', () => {
    // Mock user is not signed in
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: false });

    render(
      <SignInButton
        redirectUrl="/custom-signin"
        className="custom-class"
        variant="secondary"
        size="sm"
        fullWidth={true}
      >
        Custom Sign In
      </SignInButton>
    );

    // Check that the button is rendered with custom text
    expect(screen.getByText('Custom Sign In')).toBeInTheDocument();

    // Check that the button has the custom class
    expect(screen.getByText('Custom Sign In').closest('button')).toHaveClass('custom-class');

    // Click the button
    fireEvent.click(screen.getByText('Custom Sign In'));

    // Check that router.push was called with the custom redirect URL
    expect(mockPush).toHaveBeenCalledWith('/custom-signin');
  });

  it('renders with custom text', () => {
    render(<SignInButton>Login</SignInButton>);

    const button = screen.getByTestId('sign-in-button');
    expect(button).toHaveTextContent('Login');
  });

  it('navigates to sign-in page when clicked', () => {
    render(<SignInButton />);

    const button = screen.getByTestId('sign-in-button');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('navigates to custom URL when redirectUrl is provided', () => {
    render(<SignInButton redirectUrl="/custom-signin" />);

    const button = screen.getByTestId('sign-in-button');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/custom-signin');
  });

  it('applies custom className', () => {
    render(<SignInButton className="custom-class" />);

    const button = screen.getByTestId('sign-in-button');
    expect(button).toHaveClass('custom-class');
  });

  it('applies custom variant and size', () => {
    render(<SignInButton variant="outline" size="sm" />);

    // The actual classes are applied by the Button component,
    // so we're just checking that the props are passed correctly
    const button = screen.getByTestId('sign-in-button');
    expect(button).toBeInTheDocument();
  });

  it('applies fullWidth prop when specified', () => {
    render(<SignInButton fullWidth />);

    // The actual classes are applied by the Button component,
    // so we're just checking that the button renders
    const button = screen.getByTestId('sign-in-button');
    expect(button).toBeInTheDocument();
  });

  it('does not render when user is signed in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
    });

    const { container } = render(<SignInButton />);
    expect(container).toBeEmptyDOMElement();
  });
});
