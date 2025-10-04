// Конфигурация для кастомизации заголовка профиля

export const headerThemes = {
  default: {
    name: "По умолчанию",
    description: "Классический градиентный фон",
    background: "gradient",
    gradient: "from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90",
    textColor: "text-gray-900 dark:text-white",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    decoration: "none"
  },
  nature: {
    name: "Природа",
    description: "Зеленый лесной фон",
    background: "image",
    image: "/header-themes/nature.jpg",
    textColor: "text-white",
    accentColor: "text-green-300",
    decoration: "nature"
  },
  ocean: {
    name: "Океан",
    description: "Морской пейзаж",
    background: "image", 
    image: "/header-themes/ocean.jpg",
    textColor: "text-white",
    accentColor: "text-blue-300",
    decoration: "ocean"
  },
  space: {
    name: "Космос",
    description: "Звездное небо",
    background: "image",
    image: "/header-themes/space.jpg", 
    textColor: "text-white",
    accentColor: "text-purple-300",
    decoration: "space"
  },
  city: {
    name: "Город",
    description: "Городской пейзаж",
    background: "image",
    image: "/header-themes/city.jpg",
    textColor: "text-white", 
    accentColor: "text-yellow-300",
    decoration: "city"
  },
  abstract: {
    name: "Абстракция",
    description: "Абстрактные формы",
    background: "image",
    image: "/header-themes/abstract.jpg",
    textColor: "text-white",
    accentColor: "text-pink-300", 
    decoration: "abstract"
  }
};

export const headerDecorations = {
  none: {
    name: "Без украшений",
    elements: []
  },
  nature: {
    name: "Природные",
    elements: [
      { type: "leaf", position: "top-left", size: "small" },
      { type: "flower", position: "top-right", size: "medium" }
    ]
  },
  ocean: {
    name: "Морские",
    elements: [
      { type: "wave", position: "bottom-left", size: "large" },
      { type: "shell", position: "top-right", size: "small" }
    ]
  },
  space: {
    name: "Космические", 
    elements: [
      { type: "star", position: "scattered", size: "small" },
      { type: "planet", position: "top-right", size: "medium" }
    ]
  },
  city: {
    name: "Городские",
    elements: [
      { type: "building", position: "bottom-left", size: "large" },
      { type: "light", position: "top-right", size: "small" }
    ]
  },
  abstract: {
    name: "Абстрактные",
    elements: [
      { type: "circle", position: "center", size: "large" },
      { type: "triangle", position: "top-left", size: "medium" }
    ]
  }
};

// Получить конфигурацию темы
export function getHeaderTheme(themeKey: string) {
  return headerThemes[themeKey as keyof typeof headerThemes] || headerThemes.default;
}

// Получить конфигурацию украшений
export function getHeaderDecoration(decorationKey: string) {
  return headerDecorations[decorationKey as keyof typeof headerDecorations] || headerDecorations.none;
}

// Получить все доступные темы
export function getAllHeaderThemes() {
  return Object.entries(headerThemes).map(([key, theme]) => ({
    key,
    ...theme
  }));
}

// Конфигурация рамок для аватарки
export const avatarFrames = {
  none: {
    name: "Без рамки",
    description: "Обычная аватарка",
    className: "",
    borderColor: "",
    type: "css" as const
  },
  // Новые рамки для квадратных аватарок
  // ПРОСТЫЕ РАМКИ (4 штуки)
  simpleGold: {
    name: "Простая золотая",
    description: "Элегантная золотая рамка с градиентом",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/simple-gold.svg"
  },
  simpleSilver: {
    name: "Простая серебряная",
    description: "Классическая серебряная рамка",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/simple-silver.svg"
  },
  simpleEmerald: {
    name: "Простая изумрудная",
    description: "Природная изумрудная рамка",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/simple-emerald.svg"
  },
  simpleOcean: {
    name: "Простая морская",
    description: "Синяя морская рамка",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/simple-ocean.svg"
  },
  
  // СЛОЖНЫЕ РАМКИ (4 штуки)
  complexFire: {
    name: "Огненная",
    description: "Горящая рамка с анимированными языками пламени",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/complex-fire.svg"
  },
  complexIce: {
    name: "Ледяная",
    description: "Холодная рамка с вращающимися снежинками",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/complex-ice.svg"
  },
  complexNeon: {
    name: "Неоновая",
    description: "Яркая неоновая рамка с пульсирующими точками",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/complex-neon.svg"
  },
  complexMagic: {
    name: "Магическая",
    description: "Фиолетовая магическая рамка с вращающимися звездами",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/complex-magic.svg"
  },
  
  // МЕГА СЛОЖНЫЕ РАМКИ (4 штуки)
  megaUniverse: {
    name: "Вселенная",
    description: "Космическая рамка с анимированными звездами и планетами",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/mega-universe.svg"
  },
  megaQuantum: {
    name: "Квантовая",
    description: "Ультра-сложная квантовая рамка с движущимися частицами",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/mega-quantum.svg"
  },
  megaHologram: {
    name: "Голограмма",
    description: "Футуристическая голографическая рамка с сканирующими линиями",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/mega-hologram.svg"
  },
  megaCrystal: {
    name: "Кристалл",
    description: "Кристаллическая рамка с вращающимися гранями и радужными переливами",
    className: "",
    borderColor: "",
    type: "image" as const,
    imageUrl: "/avatar-frames/mega-crystal.svg"
  }
};

// Получить конфигурацию рамки
export function getAvatarFrame(frameKey: string) {
  return avatarFrames[frameKey as keyof typeof avatarFrames] || avatarFrames.none;
}

// Получить все доступные рамки
export function getAllAvatarFrames() {
  return Object.entries(avatarFrames).map(([key, frame]) => ({
    key,
    ...frame
  }));
}


