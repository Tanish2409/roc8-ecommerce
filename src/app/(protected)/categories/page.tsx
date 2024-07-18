"use client";

import { api } from "@/trpc/react";
import cn from "@/utils/class-names";
import { Checkbox, Pagination, type PaginationProps } from "@mantine/core";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { publicRoutes } from "@/config/routes";
import toast from "react-hot-toast";
import BounceLoader from "react-spinners/MoonLoader";

const Categories = () => {
  const [page, setPage] = useState(1);

  const router = useRouter();

  const { data: getAllCategoriesData, ...getAllCategoriesQuery } =
    api.category.getAll.useQuery(
      {
        page,
      },
      {
        enabled: true,
      },
    );

  if (getAllCategoriesQuery.isError) {
    if (getAllCategoriesQuery.error?.data?.code === "UNAUTHORIZED") {
      toast.error("Session expired. You have been logged out.");
      router.replace(publicRoutes.login.link);
    }
  }

  const categories = getAllCategoriesData?.categories ?? [];

  const totalPages = useMemo(
    () =>
      getAllCategoriesData?.count
        ? Math.ceil(getAllCategoriesData.count / getAllCategoriesData.limit)
        : 0,
    [getAllCategoriesData?.count, getAllCategoriesData?.limit],
  );

  return (
    <>
      <h2 className="mb-9 text-center text-3xl font-semibold">
        Please mark your interests!
      </h2>
      <p className="text-center text-base">We will keep you notified.</p>

      <p className="pb-7 pt-9 text-xl font-medium">My saved interests!</p>

      <div className="flex flex-col gap-6">
        {getAllCategoriesQuery.isLoading ? (
          <div className="flex min-h-72 justify-center">
            <BounceLoader size={80} />
          </div>
        ) : (
          categories.map((category) => {
            return (
              <Checkbox
                checked={false}
                label={category.name}
                key={category.id}
                onChange={() => {
                  {
                  }
                }}
                classNames={{
                  body: "flex",
                  input: "hidden",
                  inner:
                    "w-6 h-6 flex items-center justify-center bg-black rounded mr-3 cursor-pointer",
                  icon: cn("w-[14px] text-white"),
                }}
              />
            );
          })
        )}
      </div>

      <StyledPagination total={totalPages} value={page} onChange={setPage} />
    </>
  );
};

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

export default Categories;
