"use client";

import { api } from "@/trpc/react";
import cn from "@/utils/class-names";
import { Checkbox } from "@mantine/core";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { publicRoutes } from "@/config/routes";
import toast from "react-hot-toast";
import BounceLoader from "react-spinners/MoonLoader";
import StyledPagination from "@/components/StyledPagination";

const Categories = () => {
  // for pagination
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

  const apiUtils = api.useUtils();

  const updateInterestedCategoryMutation =
    api.category.updateInterested.useMutation({
      onSuccess: async () => {
        await apiUtils.category.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

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

  const handleUpdateInterestedCategory = async ({
    categoryId,
  }: {
    categoryId: string;
  }) => {
    updateInterestedCategoryMutation.mutate({
      categoryId,
    });
  };

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
                label={category.name}
                key={category.id}
                onChange={() => {
                  void handleUpdateInterestedCategory({
                    categoryId: category.id,
                  });
                }}
                classNames={{
                  body: "flex",
                  inner: cn(
                    "w-6 h-6 flex items-center justify-center bg-checkbox-bg rounded mr-3 cursor-pointer relative",
                    category.isUserInterested && "bg-black",
                    updateInterestedCategoryMutation.isPending &&
                      "opacity-50 cursor-not-allowed",
                  ),
                  input: cn(
                    "block absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer",
                    updateInterestedCategoryMutation.isPending &&
                      "cursor-not-allowed pointer-events-none",
                  ),
                  icon: cn(
                    "w-[14px] text-white hidden",
                    category.isUserInterested && "block",
                    updateInterestedCategoryMutation.isPending &&
                      "cursor-not-allowed",
                  ),
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

export default Categories;
