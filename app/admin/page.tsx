/** @format */

"use client";

import { useState } from "react";
import { axiosInstance, useCurrentUser } from "@/api";
import AppLayout from "@/components/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
// import NotFound from "../NotFound"; // TODO: Create NotFound component
import { AxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const Admin = () => {
  const { data: currentUser, isLoading } = useCurrentUser();
  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ["isAdmin", currentUser?.id],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/is-admin");
      return response.data.isAdmin;
    },
    retry(failureCount, error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDT");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const allocateCreditsMutation = useMutation({
    mutationFn: async ({
      amount,
      email,
      tokenSymbol,
    }: {
      email: string;
      amount: string;
      tokenSymbol: string;
    }) => {
      const response = await axiosInstance.post(
        "/user/balance/allocate/wallet/",
        {
          email,
          amount,
          tokenSymbol,
        }
      );

      console.log(response.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Credits allocated successfully");
      setDialogOpen(false);
      setEmail("");
      setAmount("");
    },
    onError: () => {
      toast.error("Error allocating credits");
    },
  });

  if (isLoading || isAdminLoading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return <div>Access denied</div>; // TODO: Replace with NotFound component
  }

  const handleSearchUser = async () => {
    if (!email) return toast.error("Please enter a valid email");

    try {
      const { data: user } = await axiosInstance.get(`/user/${email}`);
      console.log(user);
      setUserDetails({ ...user.user, balance: user.balance.toFixed(2) });
      setDialogOpen(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) toast.error("User not found");
      }
    }
  };

  const handleAllocateCredits = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    console.log(token, amount, email);

    allocateCreditsMutation.mutate({ email, amount, tokenSymbol: token });
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin - Allocate Credits</h1>
        <p className="text-slate-600">Allocate credits to users securely.</p>
      </div>

      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Allocate Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
              />
              <Button className="mt-2" onClick={handleSearchUser}>
                Search User
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Ensure the email is correct before proceeding.
          </p>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {userDetails ? (
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {userDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Balance:</strong> {userDetails.balance} USDT
              </p>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                  <Select value={token} onValueChange={setToken}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="INJ">INJ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="h-24 w-full" />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAllocateCredits}
              disabled={allocateCreditsMutation.isPending}
            >
              {allocateCreditsMutation.isPending ? "Allocating..." : "Allocate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Admin;
