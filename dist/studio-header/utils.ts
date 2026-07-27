import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import messages from './messages';

// Classifies the current page into a feedback "subject".
const getFeedbackSubject = (pathname) => {
  if (pathname.includes('/library')) { return 'libraries'; }
  if (pathname.includes('/settings/advanced')) { return 'advanced_settings'; }
  if (pathname.includes('/certificates')) { return 'credentials'; }
  if (pathname.includes('/container')) { return 'course_creation'; }
  if (pathname.includes('/course/')) { return 'course_outline'; }
  return 'overall_platform';
};

const getFeedbackItem = (intl) => {
  const { USER_FEEDBACK_URL: userFeedbackUrl } = getConfig();
  if (!userFeedbackUrl) {
    return null;
  }
  const user = getAuthenticatedUser();
  const params = new URLSearchParams({
    page_url: window.location.href,
    email: user?.email || '',
    subject: getFeedbackSubject(window.location.pathname),
  });
  return {
    href: `${userFeedbackUrl}&${params.toString()}`,
    title: intl.formatMessage(messages['header.user.menu.feedback']),
    openInNewTab: true,
  };
};

const getUserMenuItems = ({
  studioBaseUrl,
  logoutUrl,
  intl,
  isAdmin,
}) => {
  let items = [
    {
      href: `${studioBaseUrl}`,
      title: intl.formatMessage(messages['header.user.menu.studio']),
    }, {
      href: `${logoutUrl}`,
      title: intl.formatMessage(messages['header.user.menu.logout']),
    },
  ];
  if (isAdmin) {
    items = [
      {
        href: `${studioBaseUrl}`,
        title: intl.formatMessage(messages['header.user.menu.studio']),
      }, {
        href: `${logoutUrl}`,
        title: intl.formatMessage(messages['header.user.menu.logout']),
      },
    ];
  }

  const feedbackItem = getFeedbackItem(intl);
  return feedbackItem ? [...items.slice(0, -1), feedbackItem, items[items.length - 1]] : items;
};

export default getUserMenuItems;
