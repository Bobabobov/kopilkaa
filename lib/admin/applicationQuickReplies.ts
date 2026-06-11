import { REJECT_MULTI_ACCOUNT_REPLY_ID } from "@/lib/admin/buildMultiAccountRejectComment";

export type ApplicationQuickReply = {
  id: string;
  label: string;
  text: string;
};

export { REJECT_MULTI_ACCOUNT_REPLY_ID };

export const APPLICATION_QUICK_APPROVE_REPLIES: ApplicationQuickReply[] = [
  {
    id: "approve-thanks",
    label: "Спасибо за историю",
    text: "Заявка одобрена. Спасибо за подробное и честное описание ситуации.",
  },
];

export const APPLICATION_QUICK_REJECT_REPLIES: ApplicationQuickReply[] = [
  {
    id: REJECT_MULTI_ACCOUNT_REPLY_ID,
    label: "Мультиаккаунт",
    text: "Заявка отклонена: использование нескольких аккаунтов запрещено правилами платформы.",
  },
  {
    id: "reject-info",
    label: "Мало информации",
    text: "К сожалению, заявка отклонена: в истории недостаточно информации для принятия решения. Можно подать заявку заново с дополнениями.",
  },
  {
    id: "reject-payment",
    label: "Реквизиты",
    text: "Заявка отклонена: реквизиты указаны некорректно или неполно. Проверьте данные и отправьте заявку снова.",
  },
  {
    id: "reject-photos",
    label: "Фото не подходят",
    text: "Заявка отклонена: приложенные фото не подтверждают описанную ситуацию. Добавьте подходящие материалы и подайте заявку повторно.",
  },
  {
    id: "reject-duplicate",
    label: "Повтор / дубль",
    text: "Заявка отклонена: похоже на повторное обращение по тому же поводу или дублирование уже рассмотренной заявки.",
  },
  {
    id: "reject-suspicion",
    label: "Подозрения",
    text: "Заявка не прошла проверку. Если считаете решение ошибочным — напишите в поддержку с уточнениями.",
  },
  {
    id: "reject-rules",
    label: "Не по правилам",
    text: "Заявка отклонена: запрос не соответствует правилам платформы или категории помощи.",
  },
];
