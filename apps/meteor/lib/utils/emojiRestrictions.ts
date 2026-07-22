const SKIN_TONE_SUFFIX = /_tone[1-6](?:-[1-6])?$/;

export const normalizeEmojiName = (emoji: unknown): string => {
	if (typeof emoji !== 'string') {
		return '';
	}

	return emoji
		.trim()
		.replace(/^:+|:+$/g, '')
		.toLowerCase();
};

export const parseEmojiRestrictions = (value: unknown): ReadonlySet<string> => {
	if (typeof value !== 'string' || value.trim() === '') {
		return new Set();
	}

	return new Set(
		value
			.split(/[\s,;]+/)
			.map(normalizeEmojiName)
			.filter(Boolean),
	);
};

export const isEmojiRestricted = (emoji: unknown, restrictedEmojis: ReadonlySet<string>): boolean => {
	const normalizedEmoji = normalizeEmojiName(emoji);
	const baseEmoji = normalizedEmoji.replace(SKIN_TONE_SUFFIX, '');

	return restrictedEmojis.has(normalizedEmoji) || restrictedEmojis.has(baseEmoji);
};
