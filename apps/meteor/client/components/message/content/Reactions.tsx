import { useToolbar } from '@react-aria/toolbar';
import type { IMessage } from '@rocket.chat/core-typings';
import { MessageReactions, MessageReactionAction } from '@rocket.chat/fuselage';
import { useButtonPattern } from '@rocket.chat/fuselage-hooks';
import { usePermission, useSetting } from '@rocket.chat/ui-contexts';
import type { HTMLAttributes } from 'react';
import { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { isEmojiRestricted, parseEmojiRestrictions } from '../../../../lib/utils/emojiRestrictions';
import { MessageListContext, useOpenEmojiPicker, useUserHasReacted } from '../list/MessageListContext';
import Reaction from './reactions/Reaction';
import { useToggleReactionMutation } from './reactions/useToggleReactionMutation';

export type ReactionsProps = {
	message: IMessage;
} & HTMLAttributes<HTMLDivElement>;

const Reactions = ({ message, ...props }: ReactionsProps) => {
	const { t } = useTranslation();
	const ref = useRef(null);
	const hasReacted = useUserHasReacted(message);
	const openEmojiPicker = useOpenEmojiPicker(message);
	const { username } = useContext(MessageListContext);
	const toggleReactionMutation = useToggleReactionMutation();
	const canManageEmoji = usePermission('manage-emoji');
	const restrictedEmojis = parseEmojiRestrictions(useSetting('Message_Restricted_Emojis', ''));
	const { toolbarProps } = useToolbar(props, ref);
	const buttonProps = useButtonPattern(openEmojiPicker);

	return (
		<MessageReactions ref={ref} {...toolbarProps} {...props}>
			{message.reactions &&
				Object.entries(message.reactions).map(([name, reactions]) => (
					<Reaction
						key={name}
						counter={reactions.usernames.length}
						hasReacted={hasReacted}
						name={name}
						names={reactions.usernames.filter((user) => user !== username).map((username) => `@${username}`)}
						messageId={message._id}
						onClick={() => {
							if (!canManageEmoji && isEmojiRestricted(name, restrictedEmojis) && !hasReacted(name)) {
								return;
							}

							toggleReactionMutation.mutate({ mid: message._id, reaction: name });
						}}
					/>
				))}
			<MessageReactionAction title={t('Add_Reaction')} {...buttonProps} />
		</MessageReactions>
	);
};

export default Reactions;
