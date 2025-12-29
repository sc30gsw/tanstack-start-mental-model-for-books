import { Link } from "@tanstack/react-router";
import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { AppShell, Avatar, Group, Menu, Text, Title } from "@mantine/core";
import { IconBook, IconLogout } from "@tabler/icons-react";

export function Header() {
  const { user } = useAuth();

  const getAvatarInitials = () => {
    if (!user) {
      return "U";
    }

    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }

    if (user.lastName) {
      return user.lastName.charAt(0).toUpperCase();
    }

    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group gap="sm">
          <IconBook size={24} />
          <Title order={4}>読書メンタルモデル</Title>
        </Group>

        {user && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Group gap="xs" style={{ cursor: "pointer" }}>
                <Avatar
                  src={user.profilePictureUrl ?? undefined}
                  alt={user.firstName ?? user.email ?? "User"}
                  radius="xl"
                >
                  {getAvatarInitials()}
                </Avatar>
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Text size="sm" fw={500}>
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : (user.firstName ?? user.email)}
                </Text>
                {user.email && (
                  <Text size="xs" c="dimmed">
                    {user.email}
                  </Text>
                )}
              </Menu.Label>

              <Menu.Divider />

              <Menu.Item component={Link} to="/mental-models" leftSection={<IconBook size={16} />}>
                メンタルモデル
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                component="a"
                href="/logout"
                leftSection={<IconLogout size={16} />}
                color="red"
              >
                ログアウト
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </AppShell.Header>
  );
}
