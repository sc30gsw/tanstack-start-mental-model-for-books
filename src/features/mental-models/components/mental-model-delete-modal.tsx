import { Button, Group, Modal, Stack, Text } from "@mantine/core";

type MentalModelDeleteModalProps = {
  opened: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export function MentalModelDeleteModal({ opened, onClose, onDelete }: MentalModelDeleteModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="削除の確認" centered size="sm">
      <Stack gap="md">
        <Text>このメンタルモデルを削除してもよろしいですか？</Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            color="red"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            削除
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
