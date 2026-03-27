import { FaBook, FaWallet, FaSearch } from 'react-icons/fa';

export const emptyStateVariants = {
  noCourses: {
    icon: <FaBook />,
    title: 'No Courses Yet',
    description: 'You haven’t enrolled in any courses yet.',
    actionLabel: 'Browse Courses',
  },
  noTransactions: {
    icon: <FaWallet />,
    title: 'No Transactions',
    description: 'You haven’t made any transactions yet.',
  },
  noResults: {
    icon: <FaSearch />,
    title: 'No Results Found',
    description: 'Try adjusting your search terms.',
  },
};
