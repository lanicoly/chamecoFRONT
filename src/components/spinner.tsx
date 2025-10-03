type SpinnerProps = {
  className?: string;
};

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div className={` relative w-full flex justify-center items-center ${className ?? ""}`}>
      <div className="w-10 h-10 border-4 border-gray-200 border-l-blue-500 rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
