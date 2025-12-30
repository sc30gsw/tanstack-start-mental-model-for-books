import { ClientOnly, createFileRoute, redirect, stripSearchParams } from "@tanstack/react-router";
import { Container, Title, Stack, Tabs, Card, Group, Skeleton } from "@mantine/core";
import { Suspense } from "react";
import { MentalModelsList } from "~/features/users/components/mental-models-list";
import { valibotValidator } from "@tanstack/valibot-adapter";
import {
  userDefaultSearchParams,
  userSearchSchema,
  type UserSearchParams,
} from "~/features/users/types/schema/search-params/user-search-schema";
import { getAuth } from "@workos/authkit-tanstack-react-start";
import { PendingComponent } from "~/components/pending";
import { ErrorComponent } from "~/components/error";

export const Route = createFileRoute("/_authenticated/users/$userId")({
  component: UserPage,
  validateSearch: valibotValidator(userSearchSchema),
  search: {
    middlewares: [stripSearchParams(userDefaultSearchParams)],
  },
  loader: async ({ params }) => {
    const { userId } = params;
    const { user } = await getAuth();

    if (user?.id !== userId) {
      throw redirect({ href: "/" });
    }

    return { user };
  },
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
});

function UserPage() {
  const navigate = Route.useNavigate();

  const search = Route.useSearch();
  const activeTab = search.tab;

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={1}>マイページ</Title>

        <Tabs
          value={activeTab}
          onChange={(value) => navigate({ search: { tab: value as UserSearchParams["tab"] } })}
        >
          <Tabs.List>
            <Tabs.Tab value="liked">いいねしたメンタルモデル</Tabs.Tab>
            <Tabs.Tab value="completed">完了したメンタルモデル</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="liked" pt="md">
            <ClientOnly>
              <Suspense
                fallback={
                  <Card withBorder p="md" shadow="sm">
                    <Stack gap="md">
                      <Group gap="md" align="flex-start">
                        <Skeleton w={80} h={120} radius="xs" />
                        <Stack gap="xs" style={{ flex: 1 }}>
                          <Group justify="space-between" align="flex-start">
                            <Stack gap={4}>
                              <Skeleton height={24} width={200} />
                              <Skeleton height={16} width={150} />
                            </Stack>
                            <Skeleton height={24} width={60} radius="xl" />
                          </Group>
                          <Skeleton height={16} width="100%" />
                          <Skeleton height={16} width="80%" />
                          <Skeleton height={20} width={120} />
                        </Stack>
                      </Group>
                    </Stack>
                  </Card>
                }
              >
                <MentalModelsList emptyMessage="いいねしたメンタルモデルがありません" />
              </Suspense>
            </ClientOnly>
          </Tabs.Panel>

          <Tabs.Panel value="completed" pt="md">
            <ClientOnly>
              <Suspense
                fallback={
                  <Stack gap="md">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index} withBorder p="md" shadow="sm">
                        <Stack gap="md">
                          <Group gap="md" align="flex-start">
                            <Skeleton w={80} h={120} radius="xs" />
                            <Stack gap="xs" style={{ flex: 1 }}>
                              <Group justify="space-between" align="flex-start">
                                <Stack gap={4}>
                                  <Skeleton height={24} width={200} />
                                  <Skeleton height={16} width={150} />
                                </Stack>
                                <Skeleton height={24} width={60} radius="xl" />
                              </Group>
                              <Skeleton height={16} width="100%" />
                              <Skeleton height={16} width="80%" />
                              <Skeleton height={20} width={120} />
                            </Stack>
                          </Group>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                }
              >
                <MentalModelsList emptyMessage="完了したメンタルモデルがありません" />
              </Suspense>
            </ClientOnly>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
