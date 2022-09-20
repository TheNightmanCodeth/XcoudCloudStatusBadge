import { Button } from "./Button.tsx";

type HeaderArgs = {
    showLogo?: boolean,
    showTitle?: boolean,
    showLogin?: boolean,
}

export const Header = (args: HeaderArgs) => {
    const { showLogo = true, showTitle = true, showLogin = true} = args;
    return (
        <header
            class="h-[110px] sm:!h-[144px] w-full bg-cover bg-no-repeat relative">
            <div class="flex flex-row items-center top-0 left-0 right-0 mx-7 my-7">
                { showLogo &&
                <img class="static h-16 w-16" src="/logo.svg" alt="XCCBadger Logo" />
                }
                { showTitle &&
                <h1 class="ml-12 font-semibold text-3xl">XCCBadger</h1>
                }
                {/* Spacer() </3 */}
                <div class="flex-grow" />
                {showLogin &&
                <Button>
                    <p>Login</p>
                </Button>
                }
            </div>
        </header>
    )
}