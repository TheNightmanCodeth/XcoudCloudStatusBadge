import { PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import State from "@/schemas/state.ts";
import { config } from "@/config.ts";
import { Head } from "$fresh/runtime.ts";
import { Header } from "@/components/Header.tsx";
import ProjectsListView from "../islands/ProjectsList.tsx";
import { pocketbaseLoader, Project } from "@/communication/database.ts";

const pb = await pocketbaseLoader.getInstance();

export async function handler(
    req: Request,
    ctx: State
): Promise<Response> {
    const auth = await pb.isLoggedIn();
    console.log(auth);
    if (auth) {
        // We are authorized...
        const projects = await pb.getProjects();
        return ctx.render({ projects: projects })
    }
    return Response.redirect(`${config.base_url}/`);
}

export default function Main({url, data}: PageProps<{ projects: Project[] }>) {
    return (
        <>
            <Head>
                <title>Projects</title>
            </Head>
            <Header showLogin={false} />
            <div class="mx-7">
                <ProjectsListView start={data.projects} />
            </div>
        </>
    );
}