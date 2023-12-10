import { Service } from "@src/types.js";

export class SimpleFirebaseError extends Error {
  service: Service;

  constructor(msg: string, service: Service) {
    super(`[Simple Firebase ${service}]: ${msg}`);
    this.service = service;
  }
}
