import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CmsBoardMember,
  CmsEntry,
  CmsStructure,
} from "@/lib/emdash-content";

const legacyRoles = [
  ["immediatePastPresident", "immediatePastPresident_image", "Immediate Past President"],
  ["president", "president_image", "President"],
  ["vicePresident", "vicePresident_image", "Vice President"],
  ["secretary", "secretary_image", "Secretary"],
  ["treasurer", "treasurer_image", "Treasurer"],
  ["clubServiceDirector", "clubServiceDirector_image", "Club Service Director"],
  ["communityServiceDirector", "communityServiceDirector_image", "Community Service Director"],
  ["publicRelationDirector", "publicRelationDirector_image", "Public Relation Director"],
  [
    "professionalDevelopmentAndStrategicPlanDirector",
    "professionalDevelopmentAndStrategicPlanDirector_image",
    "Professional Development and Strategic Plan Director",
  ],
  ["professionalDevelopmentDirector", "professionalDevelopmentDirector_image", "Professional Development Director"],
  ["projectOfficer", "projectOfficer_image", "Project Officer"],
  ["fundraisingDirector", "fundraisingDirector_image", "Fundraising Director"],
  ["internationalServiceDirector", "internationalServiceDirector_image", "International Service Director"],
  ["interactDirector", "interactDirector_image", "Interact Director"],
  ["greenRotaractRepresentative", "greenRotaractRepresentative_image", "Green Rotaract Representative"],
  ["membershipAndRetentionDirector", "membershipAndRetentionDirector_image", "Membership and Retention Director"],
] as const;

function stringValue(value: CmsStructure[string]) {
  return typeof value === "string" ? value : undefined;
}

function boardMembers(data: CmsStructure): CmsBoardMember[] {
  if (Array.isArray(data.members)) return data.members;

  return legacyRoles.flatMap(([nameKey, imageKey, role]) => {
    const name = stringValue(data[nameKey]);
    if (!name) return [];

    return [{ name, role, image: stringValue(data[imageKey]) }];
  });
}

function ClubStructure({
  structures,
}: {
  structures: CmsEntry<CmsStructure>[];
}) {
  const currentYear = new Date().getFullYear().toString();
  const initialStructure =
    structures.find((structure) => structure.id.startsWith(currentYear)) ??
    structures[0];
  const [selectedId, setSelectedId] = useState(initialStructure?.id ?? "");
  const currentStructure =
    structures.find((structure) => structure.id === selectedId) ??
    initialStructure;
  const members = currentStructure ? boardMembers(currentStructure.data) : [];

  return (
    <section className="mt-5 w-full">
      <div className="container px-4 md:px-6">
        <div className="mb-8 flex justify-center">
          <Select value={currentStructure?.id} onValueChange={setSelectedId}>
            <SelectTrigger className="yearBtn mt-5 inline-flex w-[180px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {structures.map((structure) => (
                <SelectItem key={structure.id} value={structure.id}>
                  {structure.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <article
              className="flex flex-col items-center space-y-2 text-center"
              key={`${member.name}-${member.role}`}
            >
              <img
                alt={`${member.name}, ${member.role}`}
                className="h-32 w-32 rounded-full object-cover"
                loading="lazy"
                src={member.image ?? "/placeholder.svg"}
              />
              <h3 className="text-lg font-semibold leading-tight">
                {member.role}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{member.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClubStructure;
