// Конфигурация для кастомизации заголовка профиля

export const headerThemes = {
  default: {
    name: "По умолчанию",
    description: "Классический градиентный фон",
    background: "gradient",
    gradient:
      "from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90",
    textColor: "text-gray-900 dark:text-white",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    decoration: "none",
  },
  pigg: {
    name: "Забота",
    description: "Деревня",
    background: "image",
    image: "/header-themes/1.png",
    textColor: "text-white",
    accentColor: "text-pink-300",
    decoration: "none",
  },
  kopi: {
    name: "Добро",
    description: "Библиотека",
    background: "image",
    image: "/header-themes/2.png",
    textColor: "text-white",
    accentColor: "text-[#f9bc60]",
    decoration: "none",
  },
  kopi1: {
    name: "Тепло",
    description: "Ночная деревня",
    background: "image",
    image: "/header-themes/3.png",
    textColor: "text-white",
    accentColor: "text-[#f9bc60]",
    decoration: "none",
  },
  kopi2: {
    name: "Надежность",
    description: "Пейзаж с мостом",
    background: "image",
    image: "/header-themes/4.png",
    textColor: "text-white",
    accentColor: "text-[#f9bc60]",
    decoration: "none",
  },
  test: {
    name: "Единство",
    description: "Панорама города",
    background: "image",
    image: "/header-themes/5.png",
    textColor: "text-white",
    accentColor: "text-blue-300",
    decoration: "none",
  },
};

export const headerDecorations = {
  none: {
    name: "Без украшений",
    elements: [],
  },
};

// Получить конфигурацию темы
export function getHeaderTheme(themeKey: string) {
  // Если это цветная тема (начинается с "color:")
  if (themeKey.startsWith("color:")) {
    const color = themeKey.replace("color:", "");
    return {
      name: "Цветная тема",
      description: `Фон цвета ${color}`,
      background: "color" as const,
      color: color,
      textColor: "text-white",
      accentColor: "text-white",
      decoration: "none",
    };
  }
  
  return (
    headerThemes[themeKey as keyof typeof headerThemes] || headerThemes.default
  );
}

// Получить конфигурацию украшений
export function getHeaderDecoration(decorationKey: string) {
  return (
    headerDecorations[decorationKey as keyof typeof headerDecorations] ||
    headerDecorations.none
  );
}

// Получить все доступные темы
export function getAllHeaderThemes() {
  return Object.entries(headerThemes).map(([key, theme]) => ({
    key,
    ...theme,
  }));
}

// Конфигурация рамок для аватарки
export const avatarFrames = {
  none: {
    name: "Без рамки",
    description: "Обычная аватарка",
    className: "",
    borderColor: "",
    type: "css" as const,
  },
  // Новые рамки для квадратных аватарок
  // ПРОСТЫЕ РАМКИ (4 штуки)
  simpleGold: {
    name: "Простая золотая",
    description: "Элегантная золотая рамка с градиентом",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/simple-gold.svg",
  },
  simpleSilver: {
    name: "Простая серебряная",
    description: "Классическая серебряная рамка",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/simple-silver.svg",
  },
  simpleEmerald: {
    name: "Простая изумрудная",
    description: "Природная изумрудная рамка",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/simple-emerald.svg",
  },
  simpleOcean: {
    name: "Простая морская",
    description: "Синяя морская рамка",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/simple-ocean.svg",
  },

  // СЛОЖНЫЕ РАМКИ (4 штуки)
  complexFire: {
    name: "Огненная",
    description: "Горящая рамка с анимированными языками пламени",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/complex-fire.svg",
  },
  complexIce: {
    name: "Ледяная",
    description: "Холодная рамка с вращающимися снежинками",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/complex-ice.svg",
  },
  complexNeon: {
    name: "Неоновая",
    description: "Яркая неоновая рамка с пульсирующими точками",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/complex-neon.svg",
  },
  complexMagic: {
    name: "Магическая",
    description: "Фиолетовая магическая рамка с вращающимися звездами",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/complex-magic.svg",
  },

  // МЕГА СЛОЖНЫЕ РАМКИ (4 штуки)
  megaUniverse: {
    name: "Вселенная",
    description: "Космическая рамка с анимированными звездами и планетами",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/mega-universe.svg",
  },
  megaQuantum: {
    name: "Квантовая",
    description: "Ультра-сложная квантовая рамка с движущимися частицами",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/mega-quantum.svg",
  },
  megaHologram: {
    name: "Голограмма",
    description: "Футуристическая голографическая рамка с сканирующими линиями",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/mega-hologram.svg",
  },
  megaCrystal: {
    name: "Кристалл",
    description:
      "Кристаллическая рамка с вращающимися гранями и радужными переливами",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/mega-crystal.svg",
  },
};

// Получить конфигурацию рамки
export function getAvatarFrame(frameKey: string) {
  // Если это цветная рамка (начинается с "color:")
  if (frameKey.startsWith("color:")) {
    const color = frameKey.replace("color:", "");
    return {
      name: "Цветная рамка",
      description: `Рамка цвета ${color}`,
      className: "",
      borderColor: "",
      type: "color" as const,
      color: color,
    };
  }
  
  return (
    avatarFrames[frameKey as keyof typeof avatarFrames] || avatarFrames.none
  );
}

// Получить все доступные рамки
export function getAllAvatarFrames() {
  return Object.entries(avatarFrames).map(([key, frame]) => ({
    key,
    ...frame,
  }));
}
