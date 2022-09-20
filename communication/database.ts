import PocketBase from "$pocketbase";
import { config } from "$std/dotenv/mod.ts";
import { ResourceLoader } from "@/helpers/loader.ts";

await config({ export: true });

interface QueryResponseBaseItem {
    id: string;
    created: string;
    updated: string;
}

interface ProjectQueryResponseItem extends QueryResponseBaseItem {
    buildStatus: boolean;
    description: string;
    name: string;
    owner: string;
    platform: string;
    testsFailing: number;
    testsPassing: number;
}

interface QueryResponse<T extends QueryResponseBaseItem> {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: Array<T>;
}

export interface Project {
    id: string;
    name: string;
    desc: string;
    buildStatus: boolean;
    testsPassing: number;
    testsFailing: number;
    platform: string;
    owner: string;
}

export class Database {
    #client: PocketBase;

    constructor() {
        this.#client = new PocketBase(Deno.env.get("POCKETBASE_URL"));
    }

    async isLoggedIn() {
        console.log(this.#client);
        const token = await this.#client.authStore.baseToken;
        return token;
    }
    
    async login(email: string, password: string) {
        return await this.#client.users.authViaEmail(email, password);
    }

    async getProjects(): Promise<Project[]> {
        const result: QueryResponse<ProjectQueryResponseItem> = await this.#client.records.getList('projects', 1, 100, { filter: 'owner = "'+this.#client.authStore.baseModel.id+'"', });
        return result.items.map((d) => {
            return {
                id: d.id,
                name: d.name,
                desc: d.description,
                buildStatus: d.buildStatus,
                testsPassing: d.testsPassing,
                testsFailing: d.testsFailing,
                platform: d.platform,
                owner: d.owner,
            }
        })
    }
}

export const pocketbaseLoader = new ResourceLoader<Database>({
    load() {
        return Promise.resolve(new Database());
    }
})