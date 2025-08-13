export const EmptyState = () => {
  return (
    <div className="text-center py-16">
      <div className="w-32 h-32 mx-auto mb-4 opacity-60">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Illustration similar to Google Tasks empty state */}
          <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e7ff" strokeWidth="2" />
          <circle cx="100" cy="70" r="15" fill="#4285f4" />
          <rect x="85" y="85" width="30" height="2" fill="#34a853" rx="1" />
          <rect x="85" y="95" width="20" height="2" fill="#fbbc04" rx="1" />
          <rect x="85" y="105" width="25" height="2" fill="#ea4335" rx="1" />
          <path d="M70 130 L85 145 L130 100" stroke="#34a853" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Add your to-dos and keep track
      </p>
    </div>
  );
};