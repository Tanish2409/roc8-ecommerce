import { Pagination, type PaginationProps } from "@mantine/core";

const StyledPagination = (props: PaginationProps) => {
  return (
    <Pagination
      total={props.total}
      value={props.value}
      onChange={props.onChange}
      withEdges
      siblings={2}
      classNames={{
        root: "mt-12 flex [&>div]:flex [&>div]:justify-between [&>div]:w-full",
        control:
          "w-6 text-text-light data-[active=true]:text-black font-medium text-xl",
        dots: "w-[30px] text-text-light",
      }}
    />
  );
};

export default StyledPagination;
