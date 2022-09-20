import State from "@/schemas/state.ts";
// import { gitHubApi } from "../communication/github.ts";
import { pocketbaseLoader } from "../communication/database.ts";
import { config } from "@/config.ts";
import { Head } from "$fresh/runtime.ts";
import { Header } from "@/components/Header.tsx";
import { GitHubButton } from "@/components/Button.tsx";

export async function handler(
  req: Request,
  ctx: State,
): Promise<Response> {
  const pb = await pocketbaseLoader.getInstance();
  const auth = await pb.isLoggedIn();
  console.log(auth);
  if (auth) {
    // We are authorized...
    return Response.redirect(`${config.base_url}/projects`);
  }
  return await ctx.render();
}

export default function Main() {
  return (
      <>
          <Head > 
              <title>Projects</title>
          </Head>
          <Header showLogo={false} />
          <div class="flex flex-row flex-grow items-center content-center mt-16 mx-16">
            <div class="flex-grow" />
            <img class="w-72 h-72" src="/logo.svg" />
            <div class="flex flex-col items-start ml-16">
              <h1 class="font-bold text-4xl">XCCBadger</h1>
              <img class="mt-2" src="https://img.shields.io/badge/Build-Passing-success" />
              <div class=" break-normal mt-2">
                Easily create Xcode Cloud build and test status badges for your project README.
              </div>
              <div class="mt-2">
                <GitHubButton>
                  Get Started
                </GitHubButton>
              </div>
            </div>
            <div class="flex-grow" />
          </div>
      </>
  );
}