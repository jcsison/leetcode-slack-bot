import { ChatCompletionRequestMessage } from 'openai';
import { FileShareMessageEvent } from '@slack/bolt';
import { Message } from '@slack/web-api/dist/response/ChatPostMessageResponse';

import { Guard, Log } from '../../../lib/utils/helpers/index.js';
import {
  addReaction,
  getBotId,
  getReplies,
  postMessage,
  removeReaction
} from '../../actions/index.js';
import { openAI } from '../../../index.js';

export const chatGPTReply = async (
  channelId: string,
  message: FileShareMessageEvent | Message,
  token: string
) => {
  if (message.thread_ts && message.ts) {
    const replies = await getReplies(message.thread_ts, channelId, token);

    if (replies?.length && replies[0]?.text) {
      const parsedText = [
        ...replies[0].text.matchAll(
          /\*<@.+>:\*\s+&gt;(.*)\s\*ChatGPT:\*\s(.+)/gs
        )
      ];

      const originalPrompt = parsedText[0]?.[1];
      const originalResult = parsedText[0]?.[2];

      if (originalPrompt && originalResult) {
        await addReaction('eyes', channelId, message.ts, token);

        try {
          const botId = await getBotId(token);

          const context: ChatCompletionRequestMessage[] = [
            { role: 'user', content: originalPrompt },
            { role: 'assistant', content: originalResult }
          ];

          for (let i = 1; i < replies.length; i++) {
            const reply = replies[i];

            if (reply && reply.text) {
              const role = reply.user === botId ? 'assistant' : 'user';
              context.push({ role, content: reply.text });
            }
          }

          if (message.text) {
            context.push({ role: 'user', content: message.text });
          }

          const completionResponse = await openAI.createChatCompletion({
            messages: context,
            model: 'gpt-3.5-turbo'
          });

          Log.info({ response: completionResponse.data });

          const choices = completionResponse.data.choices;

          const formattedResult = choices
            .map(choice => choice.message?.content)
            .filter(Guard.string)
            .join('\n');

          await postMessage(
            formattedResult,
            channelId,
            token,
            message.thread_ts
          );

          await removeReaction('eyes', channelId, message.ts, token);
        } catch (e) {
          await removeReaction('eyes', channelId, message.ts, token);
          await addReaction('x', channelId, message.ts, token);
          throw e;
        }
      }
    }
  }
};
