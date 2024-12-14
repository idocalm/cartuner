import { Incident } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatString } from "~/utils/misc";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

interface IncidentCardProps {
  incident: Incident;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle>Incident: {incident.id.slice(0, 8)}</CardTitle>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription></CardDescription>
        <p>{formatString(incident.description, 20)}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <Button variant="outline" className="w-full">
            <Link href={`/incidents/${incident.id}`}>View incident</Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">
            Created at: {incident.createdAt.toLocaleDateString()}
          </p>
          <p className="text-muted-foreground text-sm">
            Occured at: {incident.date.toLocaleDateString()}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default IncidentCard;
