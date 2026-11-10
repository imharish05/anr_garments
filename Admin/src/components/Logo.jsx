import anrLogo from '../assets/anr-logo.jpg';

const Logo = ({ size = 'md', className = '', showText = false }) => {
  const imageSizes = {
    sm: 'h-8 max-h-8',
    md: 'h-10 max-h-10',
    lg: 'h-14 max-h-14',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={anrLogo}
        alt="ANR Hospitals"
        className={`${imageSizes[size] || imageSizes.md} w-auto object-contain rounded`}
      />
      {showText && (
        <span style={{ fontFamily: '"Montserrat", system-ui, sans-serif', fontSize: size === 'lg' ? '22px' : '17px', fontWeight: 700 }}>
          <span style={{ color: '#1a175a' }}>ANR</span>{' '}
          <span style={{ color: '#1A1A1A' }}>Hospitals</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
