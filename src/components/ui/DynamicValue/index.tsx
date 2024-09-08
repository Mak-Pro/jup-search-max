import { cssVariables } from "@/assets/styles/variables";

interface DynamicValueProps {
  value: number;
  suffix?: string;
  className?: string;
}

export const DynamicValue = ({
  value,
  suffix,
  className,
}: DynamicValueProps) => {
  return (
    <span
      style={{
        color:
          value > 0
            ? cssVariables.green
            : value < 0
            ? cssVariables.red
            : cssVariables.gray100,
      }}
      className={className}
    >
      {`${value.toFixed(2)}${suffix ? suffix : ""}`}
    </span>
  );
};
