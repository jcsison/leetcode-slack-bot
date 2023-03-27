import { CommandAction, TimeStampedMessageData } from '../helper.js';
import { Guard, Log } from '../../../lib/utils/helpers/index.js';
import { getTokenById } from '../../actions/getTokenById.js';
import { openAI } from '../../../index.js';
import { postMessage } from '../../actions/postMessage.js';

export const prompt: CommandAction<TimeStampedMessageData> = async ({
  command
}) => {
  const prompt = command.text;

  if (!prompt) {
    throw new Error('Please input a prompt.');
  }

  const token = await getTokenById({ teamId: command.team_id });

  const loadingTs = await postMessage('Please wait...', command.channel_id, token);

  try {
    const completionResponse = await openAI.createChatCompletion({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo'
    });

    Log.info({ prompt, response: completionResponse.data });

    const choices = completionResponse.data.choices;

    const formattedPrompt = prompt
      .split('\n')
      .map(fragment => `>${fragment}`)
      .join('\n');
    const formattedResult = choices
      .map(choice => choice.message?.content)
      .filter(Guard.string)
      .join('\n');

    const resultString =
      `*<@${command.user_id}>:*\n` +
      formattedPrompt +
      '\n\n*ChatGPT:*\n' +
      formattedResult;

    const updateData: TimeStampedMessageData = {
      text: resultString,
      ts: loadingTs ?? ''
    };

    return updateData;
  } catch (e) {
    throw e;
  }
};
