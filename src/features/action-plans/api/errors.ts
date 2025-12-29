export class ActionPlanNotFoundError extends Error {
  status = 404;

  constructor(id: string) {
    super(`Action plan with id ${id} not found`);
    this.name = "ActionPlanNotFoundError";
  }
}
