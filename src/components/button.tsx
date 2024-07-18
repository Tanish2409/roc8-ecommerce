import cn from "@/utils/class-names";

type Props = React.ComponentPropsWithoutRef<"button">;

const StyledButton: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <button
      className={cn(
        "mt-10 block w-full rounded-md bg-black py-[18.5px] text-base font-medium uppercase text-white disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default StyledButton;
