const Currency = ({ label = "EGP", className = "text-xl" }) => {
  return <span className={className}>{label}</span>;
};

export default Currency;