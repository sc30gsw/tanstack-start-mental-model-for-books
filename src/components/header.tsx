import { Link } from "@tanstack/react-router";
import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { AppShell, Avatar, Group, Menu, Text, Title } from "@mantine/core";

function BookIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function LogoutIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

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

  if (!user) {
    return null;
  }

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

        <Menu.Item component={Link} to="/mental-models" leftSection={<BookIcon size={16} />}>
          メンタルモデル
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item component="a" href="/logout" leftSection={<LogoutIcon size={16} />} color="red">
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
            <BookIcon size={24} />
            <Title order={4}>読書メンタルモデル</Title>
          </Group>
        </Link>

        <UserMenu />
      </Group>
    </AppShell.Header>
  );
}
