import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CollectionEntry } from "astro:content";

function ClubStructure({ structures }: { structures: CollectionEntry<"structures">[] }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const currentStructure = structures.find(
    (structure) => structure.id === year
  );

  return (
    <section className="w-full mt-5">
      <div className="container px-4 md:px-6">
        <div className="flex justify-center mb-5">
          <Select defaultValue={year} onValueChange={(value) => setYear(value)}>
            <SelectTrigger className="inline-flex w-[180px] mt-5 yearBtn">
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
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="President"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.president_image ?? "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">President</h3>
              <p className="text-gray-700">
                {currentStructure?.data.president}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Vice President"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.vicePresident_image ??
                  "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">Vice President</h3>
              <p className="text-gray-700">
                {currentStructure?.data.vicePresident}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Secretary"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.secretary_image ?? "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">Secretary</h3>
              <p className="text-gray-700">
                {currentStructure?.data.secretary}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Treasurer"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.treasurer_image ?? "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">Treasurer</h3>
              <p className="text-gray-700">
                {currentStructure?.data.treasurer}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Club Service Director"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.clubServiceDirector_image ??
                  "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">Club Service Director</h3>
              <p className="text-gray-700">
                {currentStructure?.data.clubServiceDirector}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Community Service Director"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.communityServiceDirector_image ??
                  "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">
                Community Service Director
              </h3>
              <p className="text-gray-700">
                {currentStructure?.data.communityServiceDirector}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Public Relation Director"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.publicRelationDirector_image ??
                  "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">
                Public Relation Director
              </h3>
              <p className="text-gray-700">
                {currentStructure?.data.publicRelationDirector}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Professional Development and Strategic Plan Director"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data
                    .professionalDevelopmentDirector_image ?? "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold text-center">
                Professional Development and Strategic Plan Director
              </h3>
              <p className="text-gray-700">
                {currentStructure?.data.professionalDevelopmentDirector}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Project Officer"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.projectOfficer_image ??
                  "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">Project Officer</h3>
              <p className="text-gray-700">
                {currentStructure?.data.projectOfficer}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Fundraising Director"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.fundraisingDirector_image ??
                  "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">Fundraising Director</h3>
              <p className="text-gray-700">
                {currentStructure?.data.fundraisingDirector}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="International Service Director"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.internationalServiceDirector_image ??
                  "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">
                International Service Director
              </h3>
              <p className="text-gray-700">
                {currentStructure?.data.internationalServiceDirector}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Interact Director"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.interactDirector_image ??
                  "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">Interact Director</h3>
              <p className="text-gray-700">
                {currentStructure?.data.interactDirector}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Green Rotaract Representative"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.greenRotaractRepresentative_image ??
                  "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">
                Green Rotaract Representative
              </h3>
              <p className="text-gray-700">
                {currentStructure?.data.greenRotaractRepresentative}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                alt="Membership and Retention Director"
                className="w-32 h-32 rounded-full object-cover"
                src={
                  currentStructure?.data.membershipAndRetentionDirector_image ??
                  "/placeholder.svg"
                }
              />
              <h3 className="text-lg font-semibold">
                Membership and Retention Director
              </h3>
              <p className="text-gray-700">
                {currentStructure?.data.membershipAndRetentionDirector}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClubStructure;
