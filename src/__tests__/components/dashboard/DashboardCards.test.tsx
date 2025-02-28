import { render, screen } from '@testing-library/react';
import DashboardCards from '@/components/dashboard/DashboardCards';

// Mock the framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, whileHover, initial, animate, transition, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  Book: () => <div data-testid="book-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
}));

describe('DashboardCards', () => {
  it('renders all dashboard cards', () => {
    render(<DashboardCards />);

    // Check that all card titles are rendered
    expect(screen.getByText('Create Story')).toBeInTheDocument();
    expect(screen.getByText('Story History')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();

    // Check that all card descriptions are rendered
    expect(screen.getByText('Create a new bedtime story for your child')).toBeInTheDocument();
    expect(screen.getByText('View your previously created stories')).toBeInTheDocument();
    expect(screen.getByText('Customize your story preferences')).toBeInTheDocument();

    // Check that all "Get Started" links are rendered
    const getStartedLinks = screen.getAllByText('Get Started →');
    expect(getStartedLinks).toHaveLength(3);
  });

  it('renders all icons', () => {
    render(<DashboardCards />);

    // Check that all icons are rendered
    expect(screen.getByTestId('book-icon')).toBeInTheDocument();
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<DashboardCards />);

    // Get all links and check their href attributes
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);

    // Check that links have the correct hrefs
    expect(links[0]).toHaveAttribute('href', '/story/create');
    expect(links[1]).toHaveAttribute('href', '/story/history');
    expect(links[2]).toHaveAttribute('href', '/preferences');
  });
});
