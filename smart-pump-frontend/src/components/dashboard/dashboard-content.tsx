"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";
import styles from "../../app/dashboard/dashboard.module.css";

interface UserProfile {
  name: {
    first: string;
    last: string;
  };
  phone: string;
  address: string;
}

interface Balance {
  balance: string;
}

export default function DashboardContent({ session }: { session: Session }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    setLoading(true);

    const profileRes = await fetch("http://localhost:4000/api/user/profile", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const balanceRes = await fetch("http://localhost:4000/api/user/balance", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!profileRes.ok || !balanceRes.ok) {
      setError("Failed to fetch user data");
      setLoading(false);
      return;
    }

    const profileData = await profileRes.json();
    const balanceData = await balanceRes.json();

    setBalance(balanceData);
    setProfile(profileData);
    setError(null);
    setLoading(false);
  }, [session.accessToken]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    const res = await fetch("http://localhost:4000/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        name: {
          first: updatedProfile.name?.first || "",
          last: updatedProfile.name?.last || "",
        },
        phone: updatedProfile.phone || "",
        address: updatedProfile.address || "",
      }),
    });

    if (!res.ok) {
      setError("Failed to update profile");
      return;
    }

    await fetchUserData();
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logoWrapper}>
            <Image
              src="/logo.png"
              alt="Smart Pump Logo"
              width={120}
              height={40}
              priority
            />
          </div>
          <button onClick={() => signOut()} className={styles.signOutButton}>
            Sign out
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.contentGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardHeader}>Account Balance</h2>
            <div className={styles.balanceAmount}>
              {balance?.balance ? (
                balance.balance
              ) : (
                <span className={styles.noBalance}>No balance available</span>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitleRow}>
              <h2 className={styles.cardHeader}>Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={styles.editButton}
              >
                {isEditing ? "Done" : "Edit"}
              </button>
            </div>

            {isEditing && profile ? (
              <ProfileForm
                profile={profile}
                onSubmit={handleUpdateProfile}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className={styles.profileGrid}>
                <p>
                  <span className={styles.profileLabel}>Name:</span>{" "}
                  {profile?.name?.first} {profile?.name?.last}
                </p>
                <p>
                  <span className={styles.profileLabel}>Phone:</span>{" "}
                  {profile?.phone || "N/A"}
                </p>
                <p>
                  <span className={styles.profileLabel}>Address:</span>{" "}
                  {profile?.address || "N/A"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileForm({
  profile,
  onSubmit,
  onCancel,
}: {
  profile: UserProfile;
  onSubmit: (profile: UserProfile) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<UserProfile>({
    name: {
      first: profile.name?.first || "",
      last: profile.name?.last || "",
    },
    phone: profile.phone || "",
    address: profile.address || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleCancel = () => {
    if (formData !== profile && !window.confirm("Discard changes?")) {
      return;
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>First Name</label>
        <input
          type="text"
          value={formData.name?.first || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, first: e.target.value },
            })
          }
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Last Name</label>
        <input
          type="text"
          value={formData.name?.last || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, last: e.target.value },
            })
          }
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Phone</label>
        <input
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Address</label>
        <textarea
          value={formData.address || ""}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className={`${styles.input} ${styles.textarea}`}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handleCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      </div>
    </form>
  );
}
