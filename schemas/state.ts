import { HandlerContext } from "$fresh/server.ts";

export default interface State extends HandlerContext {
    userId?: number;
}