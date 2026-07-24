import { expect } from 'chai';

import { isEmojiRestricted, normalizeEmojiName, parseEmojiRestrictions } from '../../../../lib/utils/emojiRestrictions';

describe('emojiRestrictions', () => {
	describe('normalizeEmojiName', () => {
		it('removes colons, whitespace and normalizes the case', () => {
			expect(normalizeEmojiName('  :Smile:  ')).to.equal('smile');
		});

		it('returns an empty name for a non-string value', () => {
			expect(normalizeEmojiName(undefined)).to.equal('');
		});
	});

	describe('parseEmojiRestrictions', () => {
		it('returns an empty set for an invalid value', () => {
			expect(parseEmojiRestrictions(undefined)).to.deep.equal(new Set());
		});

		it('parses comma, semicolon and whitespace separated emoji names', () => {
			expect(parseEmojiRestrictions(':smile:, angry; CUSTOM\nrocket')).to.deep.equal(new Set(['smile', 'angry', 'custom', 'rocket']));
		});
	});

	describe('isEmojiRestricted', () => {
		it('matches emoji names with or without colons', () => {
			const restrictedEmojis = new Set(['smile']);

			expect(isEmojiRestricted(':smile:', restrictedEmojis)).to.equal(true);
			expect(isEmojiRestricted('rocket', restrictedEmojis)).to.equal(false);
		});

		it('restricts skin tone variants when the base emoji is restricted', () => {
			expect(isEmojiRestricted('thumbsup_tone4', new Set(['thumbsup']))).to.equal(true);
			expect(isEmojiRestricted('handshake_tone2-5', new Set(['handshake']))).to.equal(true);
		});
	});
});
