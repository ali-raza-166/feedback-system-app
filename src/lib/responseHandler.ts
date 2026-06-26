import { NextResponse } from "next/server";

interface ResponseParams {
  status: number;
  success: boolean;
  message: string;
  data?: any;
  headers?: Record<string, string>;
}

export const sendResponse = ({
  status,
  success,
  message,
  data,
  headers,
}: ResponseParams) => {
  const responseInit: ResponseInit = {
    status,
    headers: headers ? new Headers(headers) : undefined,
  };

  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    responseInit
  );
};
