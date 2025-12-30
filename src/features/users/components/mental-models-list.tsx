import { useState } from "react";
import { Stack, Card, Center, Text, Button, Affix, ActionIcon } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";

import { MentalModelCard } from "~/features/users/components/mental-model-card";
import { useScrollToTop } from "~/features/users/hooks/use-scroll-to-top";
import { useMentalModelForUsers } from "~/features/users/hooks/use-mental-model-for-users";

export function MentalModelsList({ emptyMessage }: Record<"emptyMessage", string>) {
  const [displayedCount, setDisplayedCount] = useState(10);
  const { showScrollTop, scrollToTop } = useScrollToTop();

  const { mentalModels } = useMentalModelForUsers();

  const mentalModelsArray = Array.from(mentalModels.values());

  if (mentalModelsArray.length === 0) {
    return (
      <Card withBorder p="xl">
        <Center>
          <Text c="dimmed">{emptyMessage}</Text>
        </Center>
      </Card>
    );
  }

  const displayedModels = mentalModelsArray.slice(0, displayedCount);
  const hasMore = displayedCount < mentalModelsArray.length;

  return (
    <>
      <Stack gap="md">
        {displayedModels.map((mentalModel) => (
          <MentalModelCard key={mentalModel.id} mentalModel={mentalModel} />
        ))}

        {hasMore && (
          <Center>
            <Button onClick={() => setDisplayedCount((prev) => prev + 10)} variant="light">
              もっと表示する
            </Button>
          </Center>
        )}
      </Stack>

      {showScrollTop && (
        <Affix position={{ bottom: 20, right: 20 }}>
          <ActionIcon size="xl" radius="xl" variant="filled" color="blue" onClick={scrollToTop}>
            <IconArrowUp size={20} />
          </ActionIcon>
        </Affix>
      )}
    </>
  );
}
