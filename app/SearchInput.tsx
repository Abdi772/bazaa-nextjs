'use client';

import { useLanguage } from './LanguageProvider';

type SearchInputProps = {
  defaultValue?: string;
};

export default function SearchInput({
  defaultValue = '',
}: SearchInputProps) {
  const { t } = useLanguage();

  return (
    <input
      type="search"
      name="q"
      defaultValue={defaultValue}
      placeholder={t('searchPlaceholder')}
      aria-label={t('searchPlaceholder')}
      className="bazaa-input"
    />
  );
}
