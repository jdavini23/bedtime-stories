export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: string;
}

export interface SelectGroup<T extends string = string> {
  label: string;
  options: SelectOption<T>[];
  description?: string;
}

export interface SelectProps<T extends string = string> {
  options: SelectOption<T>[] | SelectGroup<T>[];
  value?: T | T[];
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  required?: boolean;
  loading?: boolean;
  error?: string;
}
