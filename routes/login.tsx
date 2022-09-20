import State from "@/schemas/state.ts";
import { pocketbaseLoader } from "@/communication/database.ts";
import { config } from "@/config.ts";
import { Head } from "$fresh/runtime.ts";
import { Header } from "@/components/Header.tsx";
import { useState } from "preact/hooks";
import LoginForm from "@/islands/LoginForm.tsx";

export async function handler(
    req: Request,
    ctx: State,
  ): Promise<Response> {
    const pb = await pocketbaseLoader.getInstance();
    const auth = await pb.isLoggedIn();

    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const passw = url.searchParams.get("password");
    console.log(email);
    console.log(passw);
    if (email != null && passw != null) {
        const user = await pb.login(email, passw);
        console.log(user);
        if (user || auth) {
            return Response.redirect(`${config.base_url}/projects`);
        }
    }
    return await ctx.render();
}

export default function Main() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <Head>
                <title>Projects</title>
            </Head>
            <Header />
            <LoginForm />
        </>
    );
}