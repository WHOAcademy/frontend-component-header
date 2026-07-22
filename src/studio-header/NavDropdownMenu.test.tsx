import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

import NavDropdownMenu from './NavDropdownMenu';

const defaultProps = {
  id: 'menu-id',
  buttonTitle: 'Menu',
  items: [
    { href: '/item1', title: 'Item 1' },
    { href: 'https://external.com', title: 'External Link' },
  ],
};

const RootWrapper = (props) => (
  <MemoryRouter>
    <NavDropdownMenu {...props} />
  </MemoryRouter>
);

describe('NavDropdownMenu Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the dropdown button with correct title', () => {
    render(<NavDropdownMenu {...defaultProps} />);

    const dropdownButton = screen.getByRole('button', { name: defaultProps.buttonTitle });
    expect(dropdownButton).toBeInTheDocument();
  });

  test('renders all dropdown items', () => {
    render(<RootWrapper {...defaultProps} />);

    const dropdownButton = screen.getByRole('button', { name: defaultProps.buttonTitle });
    fireEvent.click(dropdownButton);

    const item1 = screen.getByText(defaultProps.items[0].title);
    const externalLink = screen.getByText(defaultProps.items[1].title);

    expect(item1).toBeInTheDocument();
    expect(externalLink).toBeInTheDocument();
  });

  test('calls onNavigate with the correct URL for internal link', () => {
    render(<RootWrapper {...defaultProps} />);

    const dropdownButton = screen.getByRole('button', { name: defaultProps.buttonTitle });
    fireEvent.click(dropdownButton);

    const item1 = screen.getByText(defaultProps.items[0].title);
    expect(item1.getAttribute('href')).toBe(defaultProps.items[0].href);
  });

  test('navigates to external URL when external link is clicked', () => {
    render(<RootWrapper {...defaultProps} />);

    const dropdownButton = screen.getByRole('button', { name: defaultProps.buttonTitle });
    fireEvent.click(dropdownButton);

    const externalLink = screen.getByText(defaultProps.items[1].title);
    expect(externalLink.getAttribute('href')).toBe(defaultProps.items[1].href);
  });

  test('renders an item with external: true as a plain anchor with no target', () => {
    const props = {
      ...defaultProps,
      items: [{ href: 'https://awards.example.com/course-1', title: 'Awards', external: true }],
    };
    render(<RootWrapper {...props} />);

    fireEvent.click(screen.getByRole('button', { name: props.buttonTitle }));
    const link = screen.getByText('Awards').closest('a');
    expect(link).toHaveAttribute('href', props.items[0].href);
    expect(link).not.toHaveAttribute('target');
  });

  test('renders an item with openInNewTab: true as an anchor opening in a new tab', () => {
    const props = {
      ...defaultProps,
      items: [{ href: 'https://analytics.example.com', title: 'Analytics', openInNewTab: true }],
    };
    render(<RootWrapper {...props} />);

    fireEvent.click(screen.getByRole('button', { name: props.buttonTitle }));
    const link = screen.getByText('Analytics').closest('a');
    expect(link).toHaveAttribute('href', props.items[0].href);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
