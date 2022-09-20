import { useState } from "preact/hooks";
// import { Button } from "../components/Button.tsx";
import { Project } from "@/communication/database.ts";
import { Overflow } from "../components/svg.tsx";

interface ProjectListItemProps {
  proj: Project;
}
export function ProjectListItem(projectProps: ProjectListItemProps) {
  const project = projectProps.proj
  return (
    <div class="rounded-lg bg-blue-700 px-4 py-2">
      <div class="flex flex-row items-center">
        <h1 class="font-semibold text-2xl">{project.name}</h1>
        <div class="flex-grow" />
        <Overflow />
      </div>
      <span>{project.desc}</span>
    </div>
  )
}

interface ProjectsListProps {
  start: Project[];
}
export default function ProjectsListView(props: ProjectsListProps) {
  const [ projects, setProjects ] = useState(props.start);
  return (
    <div class="grid grid-cols-2 gap-x-7">
      {projects.map((proj) =>
        <div class="pb-7">
          <ProjectListItem proj={proj} />
        </div>
      )}
    </div>
  );
}
