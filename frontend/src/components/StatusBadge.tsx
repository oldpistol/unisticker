interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: StatusBadgeProps['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)} capitalize`}>
      {status}
    </span>
  );
}
