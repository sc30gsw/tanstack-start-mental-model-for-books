# 読書メンタルモデル

読書の目的を明確にし、3つの質問に答えることでより効果的な学習を実現するアプリケーションです。

## 概要

このアプリケーションは、読書前に以下の3つの質問に答えることで、読書の目的を明確にし、より効果的な学習を実現することを目的としています：

1. **Q1. なぜこの本を読もうと思ったか？**
2. **Q2. この本から何が得られそうか？**
3. **Q3. この本を読んだ後どうなっていたいか？**

## 主な機能

### メンタルモデル管理

- メンタルモデルの作成・編集・削除
- 読書ステータス管理（読書中 / 完了）
- メンタルモデル一覧の検索・フィルタリング
- いいね機能による絞り込み

### いいね機能

- メンタルモデルへのいいね機能
- いいねしたメンタルモデルの一覧表示
- いいね状態のリアルタイム更新

### アクションプラン機能

- 読書完了後のアクションプラン作成・管理
- アクションプランの編集・削除
- 完了したメンタルモデルに紐づくアクションプランの表示

### マイページ

- ユーザー専用ページ（`/users/:userId`）
- いいねしたメンタルモデルの一覧表示
- 完了したメンタルモデルの一覧表示
- アクションプランの表示

### 書籍検索

- Google Books APIとの連携
- 書籍情報の自動取得（タイトル、著者、サムネイル、説明など）

## 技術スタック

### Frontend

| Category        | Technology                                      | Version |
| --------------- | ----------------------------------------------- | ------- |
| Framework       | [TanStack Start](https://tanstack.com/start)    | Latest  |
| Routing         | [TanStack Router](https://tanstack.com/router)  | Latest  |
| UI Library      | [Mantine](https://mantine.dev/)                 | 8.3.10  |
| Form Management | [TanStack Form](https://tanstack.com/form)      | Latest  |
| Table           | [TanStack Table](https://tanstack.com/table)    | Latest  |
| Data Management | [TanStack Query DB](https://tanstack.com/query) | Latest  |
| Type Validation | [Valibot](https://valibot.dev/)                 | Latest  |
| Styling         | [Tailwind CSS](https://tailwindcss.com/)        | 4       |
| Icons           | [Tabler Icons](https://tabler.io/icons)         | Latest  |

### Backend

| Category          | Technology                                             | Version |
| ----------------- | ------------------------------------------------------ | ------- |
| Framework         | [Elysia.js](https://elysiajs.com/)                     | Latest  |
| API Documentation | [Elysia OpenAPI](https://elysiajs.com/plugins/openapi) | Latest  |
| ORM               | [Drizzle ORM](https://orm.drizzle.team/)               | Latest  |
| Database          | [Turso (LibSQL)](https://turso.tech/)                  | Latest  |

### Authentication

| Category | Technology                                                | Version |
| -------- | --------------------------------------------------------- | ------- |
| Auth     | [WorkOS AuthKit](https://workos.com/docs/user-management) | Latest  |

### Development Tools

| Category   | Technology                                                                             | Version   |
| ---------- | -------------------------------------------------------------------------------------- | --------- |
| Language   | [TypeScript Native](https://devblogs.microsoft.com/typescript/typescript-native-port/) | 7 Preview |
| Build Tool | [Vite](https://vite.dev/)                                                              | 8 Beta    |
| Linter     | [oxlint](https://oxc.rs/docs/guide/usage/linter)                                       | Latest    |
| Formatter  | [oxfmt](https://oxc.rs/docs/guide/usage/formatter)                                     | Latest    |
| Git Hooks  | [Lefthook](https://github.com/evilmartians/lefthook)                                   | Latest    |
| Runtime    | [Bun](https://bun.sh/)                                                                 | Latest    |

## Setup

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- [WorkOS](https://workos.com/) account and API key
- [Turso](https://turso.tech/) account and database URL

### Installation

```bash
# Clone the repository
git clone https://github.com/sc30gsw/tanstack-start-mental-model-for-books.git
cd tanstack-start-mental-model-for-books

# Install dependencies (git hooks are automatically set up)
bun install
```

### Environment Variables

Create a `.env` file and set the following environment variables:

```env
# WorkOS AuthKit
WORKOS_API_KEY=your_workos_api_key
WORKOS_CLIENT_ID=your_workos_client_id
WORKOS_COOKIE_PASSWORD=your_cookie_password

# Turso Database
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# Google Books API (optional)
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

### Database Migration

```bash
# Generate migration files
bun run db:generate

# Run migrations
bun run db:migrate
```

### Starting Development Server

```bash
# Start development server
bun run dev
```

Access `http://localhost:3000` in your browser.

## Scripts

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `bun run dev`         | Start development server                       |
| `bun run build`       | Build for production                           |
| `bun run start`       | Preview production build                       |
| `bun run check`       | Run linter and formatter check                 |
| `bun run fix`         | Auto-fix lint issues and format code           |
| `bun run db:generate` | Generate database migration files              |
| `bun run db:migrate`  | Run database migrations                        |
| `bun run db:studio`   | Launch Drizzle Studio (database management UI) |

## Project Structure

```
src/
├── components/          # Shared components
├── constants/           # Constants
├── db/                  # Database schema and utilities
│   ├── schema.ts        # Drizzle ORM schema definitions
│   └── index.ts         # Database connection
├── features/            # Feature modules
│   ├── action-plans/    # Action plan feature
│   ├── books/           # Book management feature
│   ├── likes/           # Like feature
│   ├── mental-models/   # Mental model feature
│   └── users/           # User feature
├── hooks/               # Custom hooks
├── lib/                 # Library configurations
├── routes/              # Route definitions (TanStack Router)
│   ├── _authenticated/  # Authenticated routes
│   └── api/            # API routes (Elysia)
└── utils/               # Utility functions
```

## API Endpoints

In development mode, you can access the auto-generated API documentation at `/openapi`.

### Mental Models API

- `GET /api/mental-models` - Get mental models list
- `GET /api/mental-models/:id` - Get mental model details
- `POST /api/mental-models` - Create mental model
- `PATCH /api/mental-models/:id` - Update mental model
- `DELETE /api/mental-models/:id` - Delete mental model

### Likes API

- `POST /api/likes/mental-models/:mentalModelId` - Add like
- `DELETE /api/likes/mental-models/:mentalModelId` - Remove like
- `GET /api/likes/mental-models` - Get liked mental models list

### Action Plans API

- `GET /api/action-plans/mental-models/:mentalModelId` - Get action plans list
- `POST /api/action-plans/mental-models/:mentalModelId` - Create action plan
- `PATCH /api/action-plans/:id` - Update action plan
- `DELETE /api/action-plans/:id` - Delete action plan

### Books API

- `GET /api/books` - Get books list
- `POST /api/books` - Create book
- `GET /api/google-books/search` - Search books via Google Books API

## VS Code Configuration

### Recommended Extension

This project recommends installing the [oxc extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) for the best development experience.

### Editor Settings

The included `.vscode/settings.json` provides the following configurations:

- **Format on Save**: oxfmt automatically formats your code when you save a file
- **Read-only Files**: The following files are set to read-only to prevent accidental edits:
  - `**/*.md` — Markdown files should be managed by AI, not edited directly
  - `bun.lock` — Auto-generated lockfile, should not be manually modified
  - `**/routeTree.gen.ts` — Auto-generated by TanStack Router, should not be manually modified

## About oxlint Configuration

This starter uses **minimal oxlint rules** with only the `correctness` category enabled. This catches obvious bugs without being intrusive, allowing you to customize the rules according to your project's needs.

You can make the linting stricter by adding more categories to `.oxlintrc.json`:

```json
{
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "perf": "warn"
  }
}
```

Available categories: `correctness`, `suspicious`, `perf`, `style`, `pedantic`, `restriction`, `nursery`

## Git Hooks with Lefthook

This starter uses [Lefthook](https://github.com/evilmartians/lefthook) for managing git hooks:

- **pre-commit**: Runs linting and format check on staged files (fast)
- **pre-push**: Runs the full `check` script before pushing (complete)

Git hooks are automatically installed when you run `bun install`.

## Developer Tools

In development mode, this starter includes [TanStack Router DevTools](https://tanstack.com/router/latest/docs/framework/react/devtools) for debugging routes and navigation. The DevTools panel appears in the bottom-right corner of your application.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
