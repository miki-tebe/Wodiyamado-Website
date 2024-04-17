import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DonationCard({
  bank,
  description,
}: {
  bank: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{bank}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs font-bold">{description}</div>
      </CardContent>
    </Card>
  );
}
