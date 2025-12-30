import { createColumnHelper } from "@tanstack/react-table";
import { ActionIcon, Image, Text, Badge, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash, IconHeart, IconHeartFilled } from "@tabler/icons-react";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { mentalModelsCollection } from "~/features/mental-models/mental-models-collections";
import { api } from "~/lib/rpc";

const columnHelper = createColumnHelper<MentalModelModel.response>();

type UseColumnsParams = {
  onEdit: (mentalModel: MentalModelModel.response) => void;
  onOpenDelete: (id: MentalModelModel.response["id"]) => void;
};

export function useMentalModelTableColumns({ onEdit, onOpenDelete }: UseColumnsParams) {
  const { user } = useAuth();

  const handleToggleLike = async (e: React.MouseEvent, mentalModel: MentalModelModel.response) => {
    e.stopPropagation();

    if (!user) {
      return;
    }

    try {
      const isLiked = mentalModel.likedByCurrentUser;

      mentalModelsCollection.update(mentalModel.id, (draft) => {
        draft.likedByCurrentUser = !isLiked;
        draft.likesCount = isLiked
          ? Math.max((draft.likesCount ?? 0) - 1, 0)
          : (draft.likesCount ?? 0) + 1;
      });

      if (isLiked) {
        const response = await api["likes"]
          ["mental-models"]({
            mentalModelId: mentalModel.id,
          })
          .delete(undefined, {
            headers: { authorization: user.id },
          });

        if (response.status !== 200) {
          mentalModelsCollection.update(mentalModel.id, (draft) => {
            draft.likedByCurrentUser = isLiked;
            draft.likesCount = mentalModel.likesCount;
          });

          throw new Error(response.error?.value?.message || "Failed to delete like");
        }
      } else {
        const response = await api["likes"]
          ["mental-models"]({
            mentalModelId: mentalModel.id,
          })
          .post(undefined, {
            headers: { authorization: user.id },
          });

        if (response.status !== 200) {
          mentalModelsCollection.update(mentalModel.id, (draft) => {
            draft.likedByCurrentUser = isLiked;
            draft.likesCount = mentalModel.likesCount;
          });

          throw new Error(response.error?.value?.message || "Failed to create like");
        }
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return [
    columnHelper.display({
      id: "like",
      header: "",
      cell: ({ row }) => {
        const mentalModel = row.original;
        return (
          <Tooltip label={mentalModel.likedByCurrentUser ? "いいねを解除" : "いいね"}>
            <ActionIcon
              variant="subtle"
              color={mentalModel.likedByCurrentUser ? "red" : "gray"}
              onClick={(e) => handleToggleLike(e, mentalModel)}
              disabled={!user}
            >
              {mentalModel.likedByCurrentUser ? (
                <IconHeartFilled size={16} />
              ) : (
                <IconHeart size={16} />
              )}
            </ActionIcon>
          </Tooltip>
        );
      },
      enableSorting: false,
      size: 50,
    }),
    columnHelper.accessor("book.thumbnailUrl", {
      id: "thumbnail",
      header: "",
      cell: (info) => (
        <Image
          src={info.getValue()}
          alt=""
          w={40}
          h={60}
          fit="cover"
          radius="xs"
          fallbackSrc="https://placehold.co/40x60?text=No+Image"
        />
      ),
      enableSorting: false,
      size: 60,
    }),
    columnHelper.accessor("book.title", {
      id: "title",
      header: "タイトル",
      cell: (info) => (
        <Text
          size="sm"
          fw={500}
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={info.getValue()}
        >
          {info.getValue()}
        </Text>
      ),
      filterFn: "includesString",
    }),
    columnHelper.accessor("book.authors", {
      id: "authors",
      header: "著者",
      cell: (info) => (
        <Text size="sm" c="dimmed" lineClamp={1}>
          {info.getValue() ?? "不明"}
        </Text>
      ),
      filterFn: "includesString",
    }),
    columnHelper.accessor("status", {
      header: "ステータス",
      cell: (info) => (
        <Badge color={info.getValue() === "completed" ? "green" : "blue"} variant="light" size="sm">
          {info.getValue() === "completed" ? "完了" : "読書中"}
        </Badge>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === "all") return true;
        return row.getValue(columnId) === filterValue;
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "作成日",
      cell: (info) => (
        <Text size="sm" c="dimmed">
          {new Date(info.getValue()).toLocaleDateString("ja-JP")}
        </Text>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "操作",
      cell: ({ row }) => (
        <Group gap="xs" wrap="nowrap">
          <Tooltip label="編集">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row.original);
              }}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="削除">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDelete(row.original.id);
              }}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    }),
  ];
}
