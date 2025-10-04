// components/profile/SettingsSection.tsx
"use client";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </label>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      )}
      {children}
    </div>
  );
}

// Компонент для отображения только для чтения
interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

export function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <SettingsSection title={label}>
      <div className="text-gray-900 dark:text-white">
        {value}
      </div>
    </SettingsSection>
  );
}
