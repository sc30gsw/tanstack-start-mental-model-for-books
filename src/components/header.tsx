import { Link } from "@tanstack/react-router";
import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { AppShell, Avatar, Group, Menu, Text, Title } from "@mantine/core";
import { useColorScheme } from "~/hooks/use-color-scheme";
import { IconBook, IconLogout, IconMoon, IconSun } from "@tabler/icons-react";

function getAvatarInitials(user: ReturnType<typeof useAuth>["user"]) {
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
}

function UserMenu() {
  const { user } = useAuth();
  const { colorScheme, setColorScheme } = useColorScheme();

  if (!user) {
    return null;
  }

  const toggleColorScheme = () => {
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Group gap="xs" style={{ cursor: "pointer" }}>
          <Avatar
            src={user.profilePictureUrl ?? undefined}
            alt={user.firstName ?? user.email ?? "User"}
            radius="xl"
          >
            {getAvatarInitials(user)}
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
          onClick={toggleColorScheme}
          leftSection={colorScheme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
        >
          {colorScheme === "dark" ? "ライトモード" : "ダークモード"}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item component="a" href="/logout" leftSection={<IconLogout size={16} />} color="red">
          ログアウト
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export function Header() {
  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Group gap="sm">
            <IconBook size={24} />
            <Title order={4}>読書メンタルモデル</Title>
          </Group>
        </Link>

        <UserMenu />
      </Group>
    </AppShell.Header>
  );
}
