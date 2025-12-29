import { useState, useCallback, useEffect, useTransition } from "react";
import { Autocomplete, Group, Image, Stack, Text, Loader } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  searchGoogleBooks,
  type BookSearchResult,
} from "~/features/mental-models/utils/search-google-books";
import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import type { GoogleBooksModel } from "~/features/books/api/models";

type BookSearchProps = {
  onSelect: (book: BookSearchResult) => void;
  disabled?: boolean;
};

export function BookSearch({ onSelect, disabled }: BookSearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  const { user } = useAuth();

  const handleSearch = useCallback(
    (query: GoogleBooksModel.SearchRequestParams["query"]) => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      startTransition(async () => {
        try {
          const books = await searchGoogleBooks(user?.id ?? "", query, 10);

          setResults(books);
        } catch {
          setResults([]);
        }
      });
    },
    [user?.id],
  );

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch(debouncedSearch);
    }
  }, [debouncedSearch, handleSearch]);

  const handleChange = (value: string) => {
    setSearchValue(value);

    if (value.length >= 2) {
      handleSearch(value);
    } else {
      setResults([]);
    }
  };

  const handleOptionSubmit = (value: string) => {
    const selected = results.find((book) => book.googleBookId === value);

    if (selected) {
      onSelect(selected);
      setSearchValue("");
      setResults([]);
    }
  };

  const data = results.map((book) => ({
    value: book.googleBookId,
    label: `${book.title} - ${book.authors ?? "著者不明"}`,
    book,
  }));

  return (
    <Autocomplete
      label="書籍を検索"
      placeholder="タイトルまたは著者名で検索..."
      value={searchValue}
      onChange={handleChange}
      onOptionSubmit={handleOptionSubmit}
      data={data}
      disabled={disabled}
      rightSection={isPending ? <Loader size="xs" /> : null}
      renderOption={({ option }) => {
        const book = results.find((b) => b.googleBookId === option.value);

        if (!book) {
          return option.value;
        }

        return (
          <Group gap="sm" wrap="nowrap">
            <Image
              src={book.thumbnailUrl ?? undefined}
              alt={book.title}
              w={40}
              h={60}
              fit="cover"
              radius="xs"
              fallbackSrc="https://placehold.co/40x60?text=No+Image"
            />
            <Stack gap={2}>
              <Text size="sm" fw={500} lineClamp={1}>
                {book.title}
              </Text>
              <Text size="xs" c="dimmed" lineClamp={1}>
                {book.authors ?? "著者不明"}
              </Text>
              {book.publishedDate && (
                <Text size="xs" c="dimmed">
                  {String(book.publishedDate)}
                </Text>
              )}
            </Stack>
          </Group>
        );
      }}
    />
  );
}
