"use client";

import { AdRequestField } from "./AdRequestField";
import { EMAIL_REGEX, getAdRequestInputClassName } from "./adRequestValidation";
import type { AdRequestFormData } from "./adRequestValidation";

interface AdRequestContactFieldsProps {
  formData: AdRequestFormData;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AdRequestContactFields({
  formData,
  errors,
  setErrors,
  handleChange,
}: AdRequestContactFieldsProps) {
  return (
    <>
      <AdRequestField
        label="Как вас зовут?"
        required
        error={errors.name}
        delay={0}
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => {
            handleChange(e);
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
          className={getAdRequestInputClassName(!!errors.name)}
          placeholder="Иван"
        />
      </AdRequestField>

      <AdRequestField
        label="Email"
        required
        error={errors.contact}
        delay={0.05}
      >
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={(e) => {
            handleChange(e);
            const value = e.target.value;
            if (errors.contact && (EMAIL_REGEX.test(value) || !value)) {
              setErrors((prev) => ({ ...prev, contact: "" }));
            }
          }}
          onBlur={(e) => {
            const value = e.target.value.trim();
            if (value && !EMAIL_REGEX.test(value)) {
              setErrors((prev) => ({
                ...prev,
                contact: "Некорректный email адрес. Пример: your@email.com",
              }));
            }
          }}
          className={getAdRequestInputClassName(!!errors.contact)}
          placeholder="your@email.com"
        />
      </AdRequestField>

      <AdRequestField label="Telegram для быстрой связи" delay={0.07}>
        <input
          type="text"
          name="telegram"
          value={formData.telegram}
          onChange={handleChange}
          className={getAdRequestInputClassName(false)}
          placeholder="@username"
        />
      </AdRequestField>

      <AdRequestField
        label="Ссылка на ваш сайт, товар или страницу"
        error={errors.website}
        delay={0.1}
      >
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={(e) => {
            handleChange(e);
            if (errors.website) setErrors((prev) => ({ ...prev, website: "" }));
          }}
          onBlur={(e) => {
            const value = e.target.value.trim();
            if (value) {
              try {
                const url = new URL(value);
                if (!url.protocol.match(/^https?:$/)) {
                  setErrors((prev) => ({
                    ...prev,
                    website: "Ссылка должна начинаться с http:// или https://",
                  }));
                }
              } catch {
                setErrors((prev) => ({
                  ...prev,
                  website:
                    "Введите корректную ссылку. Пример: https://example.com",
                }));
              }
            }
          }}
          className={getAdRequestInputClassName(!!errors.website)}
          placeholder="https://example.com"
        />
      </AdRequestField>
    </>
  );
}
