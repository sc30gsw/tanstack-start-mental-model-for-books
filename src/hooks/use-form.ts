// ? https://zenn.dev/chot/articles/d340288f30a5c8
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

const { fieldContext, formContext } = createFormHookContexts();

const fieldComponents = {}; // フィールドコンポーネントをここに定義する（例: { TextField, SelectField }）
const formComponents = {}; // フォームコンポーネントをここに定義する（例: { SubmitButton }）

export const { useAppForm, withForm } = createFormHook({
  fieldComponents,
  formComponents,
  fieldContext,
  formContext,
});
