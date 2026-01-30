import type { ComponentType } from "react";
import Section01General from "./sections/Section01General";
import Section02Concepts from "./sections/Section02Concepts";
import Section03OperatorRights from "./sections/Section03OperatorRights";
import Section04SubjectRights from "./sections/Section04SubjectRights";
import Section05Principles from "./sections/Section05Principles";
import Section06Purposes from "./sections/Section06Purposes";
import Section07Conditions from "./sections/Section07Conditions";
import Section08Order from "./sections/Section08Order";
import Section09Actions from "./sections/Section09Actions";
import Section10CrossBorder from "./sections/Section10CrossBorder";
import Section11Confidentiality from "./sections/Section11Confidentiality";
import Section12Final from "./sections/Section12Final";
import Section13PublicContent from "./sections/Section13PublicContent";

export interface TermsSectionConfig {
  number: string;
  title: string;
  delay: number;
  Content: ComponentType;
}

export const TERMS_SECTIONS: TermsSectionConfig[] = [
  {
    number: "1",
    title: "Общие положения",
    delay: 0.3,
    Content: Section01General,
  },
  {
    number: "2",
    title: "Основные понятия, используемые в Политике",
    delay: 0.4,
    Content: Section02Concepts,
  },
  {
    number: "3",
    title: "Основные права и обязанности Оператора",
    delay: 0.5,
    Content: Section03OperatorRights,
  },
  {
    number: "4",
    title: "Основные права и обязанности субъектов персональных данных",
    delay: 0.6,
    Content: Section04SubjectRights,
  },
  {
    number: "5",
    title: "Принципы обработки персональных данных",
    delay: 0.7,
    Content: Section05Principles,
  },
  {
    number: "6",
    title: "Цели обработки персональных данных",
    delay: 0.8,
    Content: Section06Purposes,
  },
  {
    number: "7",
    title: "Условия обработки персональных данных",
    delay: 0.9,
    Content: Section07Conditions,
  },
  {
    number: "8",
    title:
      "Порядок сбора, хранения, передачи и других видов обработки персональных данных",
    delay: 1.0,
    Content: Section08Order,
  },
  {
    number: "9",
    title:
      "Перечень действий, производимых Оператором с полученными персональными данными",
    delay: 1.1,
    Content: Section09Actions,
  },
  {
    number: "10",
    title: "Трансграничная передача персональных данных",
    delay: 1.2,
    Content: Section10CrossBorder,
  },
  {
    number: "11",
    title: "Конфиденциальность персональных данных",
    delay: 1.3,
    Content: Section11Confidentiality,
  },
  {
    number: "12",
    title: "Заключительные положения",
    delay: 1.4,
    Content: Section12Final,
  },
  {
    number: "13",
    title: "Публичное использование пользовательского контента",
    delay: 1.5,
    Content: Section13PublicContent,
  },
];
