"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction

 } from "./action";
export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>welcome to on-repeat</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <Input name="username" required />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
