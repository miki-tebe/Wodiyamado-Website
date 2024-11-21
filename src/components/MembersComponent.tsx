import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";

type Member = {
  firstName: string;
  lastName: string;
  quote: string;
  isApproved: boolean;
};

export default function MemberList({ members }: { members: Member[] }) {
  return (
    <>
      {members.length > 0 ? (
        <>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {members.map((member) => (
              <Card key={member.firstName + member.lastName}>
                <CardHeader className="pb-0">
                  <div className="flex items-center space-x-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarFallback>
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-sm font-medium leading-none">
                      {member.firstName} {member.lastName}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="italic pt-2">"{member.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No members found.</p>
      )}
    </>
  );
}
