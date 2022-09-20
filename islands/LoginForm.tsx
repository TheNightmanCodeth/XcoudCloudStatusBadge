import { useState } from "preact/hooks";
import { pocketbaseLoader } from "@/communication/database.ts";
import { Component } from "preact";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <>
            <form>
                <input
                    class="w-full h-9 rounded-md border border-gray-300 pl-3.5"
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onInput={(e) => setEmail(e.currentTarget.value) }
                />
                <input
                    class="w-full h-9 rounded-md border border-gray-300 pl-3.5"
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                />
                <button role="submit">
                    Login
                </button>
                </form>
        </>
    )
}