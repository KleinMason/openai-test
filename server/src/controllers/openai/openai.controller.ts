import { Application, Router } from "express";
import { TYPES } from "../../composition/app.composition.types";
import { inject, injectable } from "inversify";
import { IOpenAiService } from "../../services/openai/openai.service";
import { RouteError } from "../../models/route-error";

@injectable()
export class OpenAiController {

  private router: Router;

  constructor(
    @inject(TYPES.ExpressApplication) app: Application,
    @inject(TYPES.OpenAiService) private openAiService: IOpenAiService,
  ) {
    this.router = Router();
    this.router
      .post('/createCompletion', this.createCompletion)
      .post('/createChatCompletion', this.createChatCompletion)

    app.use('/api/openai', this.router);
  }

  createCompletion = (req: any, res: any, next: any) => {
    const prompt = req.body.prompt;
    if (!prompt) return next(new RouteError('Prompt is required', 400));
    this.openAiService.createCompletion(prompt)
      .then(response => res.json({ response }))
      .catch(err => next(new RouteError(err.message, 500)));
  }

  createChatCompletion = (req: any, res: any, next: any) => {
    const content = req.body.prompt;
    if (!content) return next(new RouteError('Content is required', 400));
    this.openAiService.createChatCompletion(content)
      .then(response => res.json({ response }))
      .catch(err => next(new RouteError(err.message, 500)));
  }
}
