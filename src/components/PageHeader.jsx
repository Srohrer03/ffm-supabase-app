import React from 'react';

const PageHeader = ({ 
  title, 
  subtitle, 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-cfs-navy to-cfs-dark';
      case 'solid':
        return 'bg-cfs-navy';
      case 'light':
        return 'bg-white border border-gray-200';
      default:
        return 'bg-gradient-to-r from-cfs-navy to-cfs-dark';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'light':
        return {
          title: 'text-cfs-navy',
          subtitle: 'text-gray-600'
        };
      default:
        return {
          title: 'text-white',
          subtitle: 'text-white/80'
        };
    }
  };

  const textStyles = getTextStyles();

  return (
    <div className={`${getVariantStyles()} rounded-xl shadow-xl border border-cfs-blue/20 p-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className={`text-4xl font-bold ${textStyles.title} mb-3 leading-tight`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`${textStyles.subtitle} text-base leading-relaxed mt-3`}>
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;