export class LikeNotFoundError extends Error {
  status = 404;

  constructor(mentalModelId: string, userId: string) {
    super(`Like not found for mental model ${mentalModelId} and user ${userId}`);
    this.name = "LikeNotFoundError";
  }
}
