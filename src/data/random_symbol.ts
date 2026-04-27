type LocaleData = {
  title: string
	subtitle: string
	game?: string
	background?: string
}

type RandomSymbol = {
  item: string
  en: LocaleData
  ru: LocaleData
}

type RandomSymbols = Record<string, RandomSymbol>

export const backgroundSymbols = {
	yi_jing: "",
}

export const randomSymbols = {
	big_yus_iotified: {
		item: "\u046C",
		en: {
			title: "Big Yus Iotified",
			subtitle: "Cyrillic@https://en.wikipedia.org/wiki/Cyrillic_script"
		},
		ru: {
			title: "Большой Юс Йотированный",
			subtitle: "Кириллица@https://ru.wikipedia.org/wiki/Кириллица"
		}
	},
	yin_yang: {
		item: "\u262F\uFE0E",
		en: {
			title: "Yīn Yáng",
			subtitle: "Dào@https://en.wikipedia.org/wiki/Tao"
		},
		ru: {
			title: "Инь и Ян",
			subtitle: "Дао@https://ru.wikipedia.org/wiki/Дао"
		}
	},
	trigram_dui: {
		item: "\u2631",
		en: {
			title: "Trigram <span class='underline-dot question' title='兌 [duì]'>Duì</span> (Lake)",
			subtitle: "Eight Trigrams@https://en.wikipedia.org/wiki/Bagua"
		},
		ru: {
			title: "Триграмма <span class='underline-dot question' title='兌 [duì]'>Дуй</span> (Водоём)",
			subtitle: "Восемь триграмм@https://ru.wikipedia.org/wiki/Восемь_триграмм"
		}
	},
	trigram_xun: {
		item: "\u2634",
		en: {
			title: "Trigram <span class='underline-dot question' title='巽 [xùn]'>Xùn</span> (Wind)",
			subtitle: "Eight Trigrams@https://en.wikipedia.org/wiki/Bagua"
		},
		ru: {
			title: "Триграмма <span class='underline-dot question' title='巽 [xùn]'>Сюнь</span> (Ветер)",
			subtitle: "Восемь триграмм@https://ru.wikipedia.org/wiki/Восемь_триграмм"
		}
	},
	trigram_kan: {
		item: "\u2635",
		en: {
			title: "Trigram <span class='underline-dot question' title='坎 [kǎn]'>Kǎn</span> (Water)",
			subtitle: "Eight Trigrams@https://en.wikipedia.org/wiki/Bagua"
		},
		ru: {
			title: "Триграмма <span class='underline-dot question' title='坎 [kǎn]'>Кань</span> (Вода)",
			subtitle: "Восемь триграмм@https://ru.wikipedia.org/wiki/Восемь_триграмм"
		}
	},
	hexagram_tai: {
		item: "\u4DCA",
		en: {
			title: "Hexagram <span class='underline-dot question' title='泰 [tài]'>Tài</span> (Peace)",
			subtitle: "Sixty-four Hexagrams@https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching"
		},
		ru: {
			title: "Гексаграмма <span class='underline-dot question' title='泰 [tài]'>Тай</span> (Расцвет)",
			subtitle: "Шестьдесят четыре гексаграммы@https://ru.wikipedia.org/wiki/Гексаграмма_(И_цзин)"
		}
	},
	hexagram_li: {
		item: "\u4DDD",
		en: {
			title: "Hexagram <span class='underline-dot question' title='離 [lí]'>Lí</span> (Radiance)",
			subtitle: "Sixty-four Hexagrams@https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching"
		},
		ru: {
			title: "Гексаграмма <span class='underline-dot question' title='離 [lí]'>Ли</span> (Сияние)",
			subtitle: "Шестьдесят четыре гексаграммы@https://ru.wikipedia.org/wiki/Гексаграмма_(И_цзин)"
		}
	},
	tetragram_shang: {
		item: "\uD834\uDF0C",
		en: {
			title: "Tetragram <span class='underline-dot question' title='上 [shàng]'>Shàng</span> (Ascension)",
			subtitle: "Eighty-one Tetragrams@https://en.wikipedia.org/wiki/Taixuanjing"
		},
		ru: {
			title: "Тетраграмма <span class='underline-dot question' title='上 [shàng]'>Шан</span> (Восхождение)",
			subtitle: "Восемьдесят одна тетраграмма@https://zh.wikipedia.org/zh-cn/太玄"
		}
	},
	tetragram_le: {
		item: "\uD834\uDF1D",
		en: {
			title: "Tetragram <span class='underline-dot question' title='乐 [lè]'>Lè</span> (Joy)",
			subtitle: "Eighty-one Tetragrams@https://en.wikipedia.org/wiki/Taixuanjing"
		},
		ru: {
			title: "Тетраграмма <span class='underline-dot question' title='乐 [lè]'>Лэ</span> (Радость)",
			subtitle: "Восемьдесят одна тетраграмма@https://zh.wikipedia.org/zh-cn/太玄"
		}
	},
	copper_venus: {
		item: "\u2640\uFE0E",
		en: {
			title: "Copper / Venus",
			subtitle: "Alchemy@https://en.wikipedia.org/wiki/Alchemy, Astrology@https://en.wikipedia.org/wiki/Astrology"
		},
		ru: {
			title: "Медь / Венера",
			subtitle: "Алхимия@https://ru.wikipedia.org/wiki/Алхимия, Астрология@https://ru.wikipedia.org/wiki/Астрология"
		}
	},
	iron_mars: {
		item: "\u2642\uFE0E",
		en: {
			title: "Iron / Mars",
			subtitle: "Alchemy@https://en.wikipedia.org/wiki/Alchemy, Astrology@https://en.wikipedia.org/wiki/Astrology"
		},
		ru: {
			title: "Железо / Марс",
			subtitle: "Алхимия@https://ru.wikipedia.org/wiki/Алхимия, Астрология@https://ru.wikipedia.org/wiki/Астрология"
		}
	},
	sulfur: {
		item: "\uD83D\uDF0D",
		en: {
			title: "Sulfur",
			subtitle: "Alchemy@https://en.wikipedia.org/wiki/Alchemy"
		},
		ru: {
			title: "Сера",
			subtitle: "Алхимия@https://ru.wikipedia.org/wiki/Алхимия"
		}
	},
	hades: {
		item: "\u2BE1",
		en: {
			title: "Hades",
			subtitle: "Uranian Astrology@https://en.wikipedia.org/wiki/Hamburg_School_of_Astrology"
		},
		ru: {
			title: "Аид",
			subtitle: "Ураническая астрология@https://ru.wikipedia.org/wiki/Ураническая_астрология"
		}
	},
	cupido: {
		item: "\u2BE0",
		en: {
			title: "Cupido",
			subtitle: "Uranian Astrology@https://en.wikipedia.org/wiki/Hamburg_School_of_Astrology"
		},
		ru: {
			title: "Купидон",
			subtitle: "Ураническая астрология@https://ru.wikipedia.org/wiki/Ураническая_астрология"
		}
	},
	vulcanus: {
		item: "\u2BE6",
		en: {
			title: "Vulcanus",
			subtitle: "Uranian Astrology@https://en.wikipedia.org/wiki/Hamburg_School_of_Astrology"
		},
		ru: {
			title: "Вулкан",
			subtitle: "Ураническая астрология@https://ru.wikipedia.org/wiki/Ураническая_астрология"
		}
	},
	ankh: {
		item: "\u2625",
		en: {
			title: "Ankh",
			subtitle: "Ancient Egypt@https://en.wikipedia.org/wiki/Ancient_Egypt"
		},
		ru: {
			title: "Анх",
			subtitle: "Древний Египет@https://ru.wikipedia.org/wiki/Древний_Египет"
		}
	},
	caduceus: {
		item: "\u269A\u2624",
		en: {
			title: "Caduceus",
			subtitle: "Ancient Greece@https://en.wikipedia.org/wiki/Ancient_Greece, Ancient Rome@https://en.wikipedia.org/wiki/Ancient_Rome"
		},
		ru: {
			title: "Кадуцей",
			subtitle: "Древняя Греция@https://ru.wikipedia.org/wiki/Древняя_Греция, Древний Рим@https://ru.wikipedia.org/wiki/Древний_Рим"
		}
	},
	korean_won: {
		item: "\u20A9",
		en: {
			title: "South Korean Won",
			subtitle: "South Korea@https://en.wikipedia.org/wiki/South_Korea"
		},
		ru: {
			title: "Корейский вона",
			subtitle: "Республика Корея@https://ru.wikipedia.org/wiki/Республика_Корея"
		}
	},
	japanese_yen: {
		item: "\u00A5",
		en: {
			title: "Japanese Yen / Chinese Yuan",
			subtitle: "Japan@https://en.wikipedia.org/wiki/Japan, China@https://en.wikipedia.org/wiki/China"
		},
		ru: {
			title: "Японская иена / Китайский юань",
			subtitle: "Япония@https://ru.wikipedia.org/wiki/Япония, Китай@https://ru.wikipedia.org/wiki/Китайская_Народная_Республика"
		}
	},
	benzene_ring: {
		item: "\u232C",
		en: {
			title: "Benzene",
			subtitle: "Chemistry@https://en.wikipedia.org/wiki/Chemistry"
		},
		ru: {
			title: "Бензол",
			subtitle: "Химия@https://ru.wikipedia.org/wiki/Химия"
		}
	},
	abkhazian_tswe: {
		item: "\uA68E",
		en: {
			title: "Tswe",
			subtitle: "Uslar Cyrillic (Abkhazia)@https://en.wikipedia.org/wiki/Abkhaz_alphabet"
		},
		ru: {
			title: "Цвэ",
			subtitle: "Кириллица Услара (Абхазия)@https://ru.wikipedia.org/wiki/Абхазская_письменность#Кириллица_Услара"
		}
	},
	romanian_yn: {
		item: "\uA65E",
		en: {
			title: "Yn",
			subtitle: "Romanian Cyrillic@https://en.wikipedia.org/wiki/Romanian_Cyrillic_alphabet"
		},
		ru: {
			title: "Ын",
			subtitle: "Валахо-молдавская кириллица@https://ru.wikipedia.org/wiki/Валахо-молдавская_азбука"
		}
	},
	thorn: {
		item: "\u00DE",
		en: {
			title: "Thorn",
			subtitle: "Old English@https://en.wikipedia.org/wiki/Old_English, Icelandic@https://en.wikipedia.org/wiki/Icelandic_language"
		},
		ru: {
			title: "Торн",
			subtitle: "Древнеанглийский@https://ru.wikipedia.org/wiki/Древнеанглийский, Исландский@https://ru.wikipedia.org/wiki/Исландский_язык"
		}
	},
	egyptological_yod: {
		item: "\uA7BC",
		en: {
			title: "Yod",
			subtitle: "Egyptological Transliteration@https://en.wikipedia.org/wiki/Transliteration_of_Ancient_Egyptian"
		},
		ru: {
			title: "Йод",
			subtitle: "Египтологическая транслитерация@https://ru.wikipedia.org/wiki/Транслитерация_египетских_текстов"
		}
	},
	omega_psili_perispomeni_prosgegrammeni: {
		item: "\u1FAE",
		en: {
			title: "Omega with Psili, Perispomeni and Prosgegrammeni",
			subtitle: "Ancient Greek@https://en.wikipedia.org/wiki/Ancient_Greek"
		},
		ru: {
			title: "Омега с псили, периспомени и просгеграммени",
			subtitle: "Древнегреческий@https://ru.wikipedia.org/wiki/Древнегреческий_язык"
		}
	},
	samaritan_alaf: {
		item: "\u0800",
		en: {
			title: "Alaf",
			subtitle: "Samaritan@https://en.wikipedia.org/wiki/Samaritan_script"
		},
		ru: {
			title: "Алаф",
			subtitle: "Самаритянский@https://ru.wikipedia.org/wiki/Самаритянское_письмо"
		}
	},
	algiz: {
		item: "\u16C9",
		en: {
			title: "Algiz",
			subtitle: "Elder Futhark@https://en.wikipedia.org/wiki/Elder_Futhark"
		},
		ru: {
			title: "Альгиз",
			subtitle: "Старший Футарк@https://ru.wikipedia.org/wiki/Руны"
		}
	},
	fehu: {
		item: "\u16A0",
		en: {
			title: "Fehu",
			subtitle: "Elder Futhark@https://en.wikipedia.org/wiki/Elder_Futhark"
		},
		ru: {
			title: "Феху",
			subtitle: "Старший Футарк@https://ru.wikipedia.org/wiki/Руны"
		}
	},
	othala: {
		item: "\u16DF",
		en: {
			title: "Othala",
			subtitle: "Elder Futhark@https://en.wikipedia.org/wiki/Elder_Futhark"
		},
		ru: {
			title: "Одал",
			subtitle: "Старший Футарк@https://ru.wikipedia.org/wiki/Руны"
		}
	},
	tvimadur: {
		item: "\u16EF",
		en: {
			title: "Tvímánuður",
			subtitle: "Runic Calendar@https://en.wikipedia.org/wiki/Runic_calendar"
		},
		ru: {
			title: "Твимадур",
			subtitle: "Рунический календарь@https://ru.wikipedia.org/wiki/Рунический_календарь"
		}
	},
	orkhon_aeb: {
		item: "\uD803\uDC0B",
		en: {
			title: "Aeb",
			subtitle: "Orkhon Variant of Old Turkic@https://en.wikipedia.org/wiki/Old_Turkic_script"
		},
		ru: {
			title: "Ябь",
			subtitle: "Орхонский репертуар Древнетюркского@https://ru.wikipedia.org/wiki/Древнетюркское_письмо#Орхонский_репертуар"
		}
	},
	orkhon_at: {
		item: "\uD803\uDC43",
		en: {
			title: "At",
			subtitle: "Orkhon Variant of Old Turkic@https://en.wikipedia.org/wiki/Old_Turkic_script"
		},
		ru: {
			title: "Ат",
			subtitle: "Орхонский репертуар Древнетюркского@https://ru.wikipedia.org/wiki/Древнетюркское_письмо#Орхонский_репертуар"
		}
	},
	yenisei_aeb: {
		item: "\uD803\uDC0C",
		en: {
			title: "Aeb",
			subtitle: "Yenisei Variant of Old Turkic@https://en.wikipedia.org/wiki/Old_Turkic_script"
		},
		ru: {
			title: "Ябь",
			subtitle: "Енисейский репертуар Древнетюркского@https://ru.wikipedia.org/wiki/Древнетюркское_письмо#Енисейский_репертуар"
		}
	},
	yenisei_at: {
		item: "\uD803\uDC44",
		en: {
			title: "At",
			subtitle: "Yenisei Variant of Old Turkic@https://en.wikipedia.org/wiki/Old_Turkic_script"
		},
		ru: {
			title: "Ат",
			subtitle: "Енисейский репертуар Древнетюркского@https://ru.wikipedia.org/wiki/Древнетюркское_письмо#Енисейский_репертуар"
		}
	},
	ipa_near_close_near_back_rounded_vowel: {
		item: "\u028A",
		en: {
			title: "Near-close near-back rounded vowel",
			subtitle: "International Phonetic Alphabet@https://en.wikipedia.org/wiki/International_Phonetic_Alphabet"
		},
		ru: {
			title: "Ненапряжённый огублённый гласный заднего ряда верхнего подъёма",
			subtitle: "Международный фонетический алфавит@https://ru.wikipedia.org/wiki/Международный_фонетический_алфавит"
		}
	},
	ipa_epiglottal_polsive: {
		item: "\u02A1",
		en: {
			title: "Epiglottal plosive",
			subtitle: "International Phonetic Alphabet@https://en.wikipedia.org/wiki/International_Phonetic_Alphabet"
		},
		ru: {
			title: "Эпиглоттальный взрывной согласный",
			subtitle: "Международный фонетический алфавит@https://ru.wikipedia.org/wiki/Международный_фонетический_алфавит"
		}
	},
	chess_knight_queen: {
		item: "\uD83E\uDE51",
		en: {
			title: "Knight-Queen",
			subtitle: "Chess@https://en.wikipedia.org/wiki/Chess"
		},
		ru: {
			title: "Конь-Ферзь",
			subtitle: "Шахматы@https://ru.wikipedia.org/wiki/Шахматы"
		}
	},
	card_queen_of_hearts: {
		item: "\uD83C\uDCBD",
		en: {
			title: "Queen of Hearts",
			subtitle: "Playing Cards@https://en.wikipedia.org/wiki/Playing_card"
		},
		ru: {
			title: "Червонная дама",
			subtitle: "Игральные карты@https://ru.wikipedia.org/wiki/Игральные_карты"
		}
	},
	card_knight_of_clubs: {
		item: "\uD83C\uDCDC",
		en: {
			title: "Knight of Clubs",
			subtitle: "Playing Cards@https://en.wikipedia.org/wiki/Playing_card"
		},
		ru: {
			title: "Трефовый кавалер",
			subtitle: "Игральные карты@https://ru.wikipedia.org/wiki/Игральные_карты"
		}
	},
	xiangqi_jiang: {
		item: "\uD83E\uDE67",
		en: {
			title: "Piece <span class='underline-dot question' title='將 [jiàng]'>Jiàng</span> (General)",
			subtitle: "Xiàngqí@https://en.wikipedia.org/wiki/Xiangqi"
		},
		ru: {
			title: "Фигура <span class='underline-dot question' title='將 [jiàng]'>Цзян</span> (Генерал)",
			subtitle: "Сянци@https://ru.wikipedia.org/wiki/Сянци"
		}
	},
	xiangqi_shuai: {
		item: "\uD83E\uDE60",
		en: {
			title: "Piece <span class='underline-dot question' title='帥 [shuài]'>Shuài</span> (Marshal)",
			subtitle: "Xiàngqí@https://en.wikipedia.org/wiki/Xiangqi"
		},
		ru: {
			title: "Фигура <span class='underline-dot question' title='帥 [shuài]'>Шуай</span> (Маршал)",
			subtitle: "Сянци@https://ru.wikipedia.org/wiki/Сянци"
		}
	},
	xiangqi_xiang: {
		item: "\uD83E\uDE62",
		en: {
			title: "Piece <span class='underline-dot question' title='相 [xiàng]'>Xiàng</span> (Minister)",
			subtitle: "Xiàngqí@https://en.wikipedia.org/wiki/Xiangqi"
		},
		ru: {
			title: "Фигура <span class='underline-dot question' title='相 [xiàng]'>Сян</span> (Министр)",
			subtitle: "Сянци@https://ru.wikipedia.org/wiki/Сянци"
		}
	}
} satisfies RandomSymbols
