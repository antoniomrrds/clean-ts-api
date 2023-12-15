export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const getEnumKeyByValue = (
  value: number = HttpStatus.INTERNAL_SERVER_ERROR,
): string => {
  const key = Object.keys(HttpStatus).find(
    key => HttpStatus[key as keyof typeof HttpStatus] === value,
  );
  return key!;
};
