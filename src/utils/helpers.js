export const formatCurrency = (amount) => {
  return '₹' + Number(amount).toLocaleString('en-IN');
};

export const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStatusColor = (status) => {
  const map = {
    Active: '#4CAF50',
    Inactive: '#9E9E9E',
    Open: '#F44336',
    'In Progress': '#FF9800',
    Resolved: '#4CAF50',
    In: '#4CAF50',
    Out: '#9E9E9E',
    Available: '#4CAF50',
    'Under Maintenance': '#FF9800',
    Booked: '#2196F3',
    High: '#F44336',
    Medium: '#FF9800',
    Low: '#4CAF50',
    Critical: '#B71C1C',
  };
  return map[status] || '#757575';
};

export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
