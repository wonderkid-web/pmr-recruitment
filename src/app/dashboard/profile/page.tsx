"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { UserRound } from "lucide-react";
import { Member } from "@/interfaces/member";

export default function MemberProfilePage() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const memberId = localStorage.getItem("id");

    if (!memberId) {
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/member/${memberId}`);
        if (!res.ok) throw new Error("Failed to fetch member profile");
        const data = await res.json();
        setMember(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        Profile not found.
      </p>
    );
  }

  return (
    <div className="mx-auto py-10 w-fit">
      <Card>
        <CardHeader>
          <UserRound scale={5} size={100} className="mx-auto" />
          <CardTitle>Member Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <div>
            <strong>Name:</strong> {member.name}
          </div>
          <div>
            <strong>Email:</strong> {member.email}
          </div>
          <div>
            <strong>Class:</strong> {member.schoolOrigin}
          </div>
          <div>
            <strong>Class:</strong> {member.class}
          </div>
          <div>
            <strong>Gender:</strong>{" "}
            {member.gender === "MALE" ? "Male" : "Female"}
          </div>
          <div>
            <strong>Position:</strong> {member.position}
          </div>
          <div>
            <strong>Joined At:</strong>{" "}
            {format(new Date(member.joined_at), "PPP")}
          </div>

          {/* <div className="pt-4">
            <Button onClick={() => router.push("/member/profile/edit")}>
              Edit Profile
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
