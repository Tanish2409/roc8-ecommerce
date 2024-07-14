type Props = React.ComponentPropsWithoutRef<"div">;

const BoxContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="border-border-light w-full rounded-[20px] border px-[60px] py-10 md:w-[576px]">
      {children}
    </div>
  );
};

export default BoxContainer;
