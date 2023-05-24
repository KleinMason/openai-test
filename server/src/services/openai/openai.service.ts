import { inject, injectable } from "inversify";
import { Configuration, OpenAIApi } from "openai";
import { TYPES } from "../../composition/app.composition.types";
import { AppConfig } from "../../models/app.config";

export interface IOpenAiService {
  createCompletion: (prompt: string) => Promise<string>;
  createChatCompletion: (content: string) => Promise<string>;
}

@injectable()
export class OpenAiService {

  private _api: OpenAIApi;

  constructor(
    @inject(TYPES.AppConfig) private appConfig: AppConfig
  ) {
    const configuration = new Configuration({
      apiKey: this.appConfig.openai.apiKey,
    });
    this._api = new OpenAIApi(configuration);
  }

  // https://beta.openai.com/docs/api-reference/create-completion
  createCompletion = (prompt: string): Promise<string> => {
    return this._api.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 2000,
    }).then(response => response.data.choices[0].text);
  }

  // https://beta.openai.com/docs/api-reference/create-chat-completion
  createChatCompletion = (content: string): Promise<string> => {
    return this._api.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: content}]
    }).then(response => response.data.choices[0].message.content);
  }
}
