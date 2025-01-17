import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/Commons/Input";
import Button from "@/components/Commons/Button";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

export default function Account() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    lastUpdated: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [modifyPassword, setModifyPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const userId = session?.user?.id;
  const { user, mutateUser } = useUser(userId);

  useEffect(() => {
    if (session?.user?.id) {
      const getUser = async () => {
        const res = await fetch(`/api/users/${session.user?.id}`);
        const data = await res.json();
        console.log(data);
        setFormData((prevState) => ({
          ...prevState,
          name: data.name || "",
          email: data.email || "",
          lastUpdated: new Date(data.updatedAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setIsLoadingData(false);
      };
      getUser();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoadingSave(true);
    if (!session?.user?.id) {
      console.error("No active session");
      setIsLoadingSave(false);
      return;
    }

    try {
      // Check old password if modifying password
      if (modifyPassword) {
        const res = await fetch(
          `/api/users/${session.user.id}/verify-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: formData.oldPassword }),
          }
        );

        const data = await res.json();

        if (!data.success) {
          setError("Old password is incorrect");
          return;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
          setError("New passwords do not match");
          return;
        }
      }

      const formDataCopy: {
        name: string;
        email: string;
        lastUpdated?: string;
        oldPassword?: string;
        newPassword?: string;
        confirmNewPassword?: string;
      } = { ...formData };

      if (!modifyPassword) {
        delete formDataCopy.oldPassword;
        delete formDataCopy.newPassword;
        delete formDataCopy.confirmNewPassword;
      }

      console.log(formDataCopy);
      // Update user data
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataCopy),
      });

      const data = await res.json();
      console.log(data);
      setFormData((prevState) => ({
        ...prevState,
        lastUpdated: new Date(data.updatedAt).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setSuccess("Account updated successfully");
      mutateUser();
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Update error:", error);
    } finally {
      setIsLoadingSave(false);
    }
  };

  return (
    <div className="auth-form w-full text-center">
      <div className="border-b-2 border-bt-modal py-2">
        <h2 className="text-xl font-bold">Account Settings</h2>
      </div>
      {!session ? (
        <p>You are not logged in</p>
      ) : isLoadingData ? (
        <div className="flex justify-center m-1">
          <div className="loading-text">
            Loading<span className="dots"></span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* <p>Session ID: {session.user?.id || "No ID available"}</p> */}
          <div>
            <Input
              id="name"
              name="name"
              label="Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              autoCorrect="off"
              required
              className="mt-1 p-2 w-full"
            />
          </div>
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              autoCorrect="off"
              value={formData.email}
              onChange={handleInputChange}
              required
              label={"Email"}
              className="mt-1 p-2 w-full"
            />
          </div>
          {modifyPassword && (
            <>
              <div>
                <Input
                  id="oldPassword"
                  label="Old Password"
                  name="oldPassword"
                  type="password"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full"
                />
              </div>
              <div>
                <Input
                  id="newPassword"
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full"
                />
              </div>
              <div>
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  label="Confirm New Password"
                  type="password"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full"
                />
              </div>
            </>
          )}
          <div>
            <p className="text-xs text-gray-500">
              Last updated: {formData.lastUpdated}
            </p>
          </div>
          {error && (
            <div>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div>
              <p className="text-green-500 text-sm">{success}</p>
            </div>
          )}
          <div>
            <Button type="submit" variant="primary" disabled={isLoadingSave}>
              {isLoadingSave ? <div className="loader mx-auto"></div> : "Save"}
            </Button>
          </div>
          <div>
            <Link
              onClick={() => setModifyPassword(!modifyPassword)}
              href={modifyPassword ? "#" : "#"}
              className="w-full hover:underline"
            >
              {modifyPassword ? "Cancel" : "Modify Password"}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
