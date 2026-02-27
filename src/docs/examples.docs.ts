const ServerError = {
  ok: false,
  detail: 'internal server error',
};

const EntityNotFound = {
  ok: false,
  detail: 'resource not found',
};

const ZodError = {
  ok: false,
  detail: [
    {
      message: 'restriccion failed',
    },
  ],
};

export default {
  ServerError,
  ZodError,
  EntityNotFound,
};
