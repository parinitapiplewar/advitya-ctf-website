"use client";

import React, { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CategoryFilter from "./CategoryFilter";
import ChallengeGrid from "./ChallengeGrid";
import ChallengeModal from "./ChallengeModal";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [solvedChallenges, setSolvedChallenges] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingFlag, setSubmittingFlag] = useState(null);
  const [flagInputs, setFlagInputs] = useState({});
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web", label: "Web" },
    { value: "OSINT", label: "OSINT" },
    { value: "pwn", label: "PWN" },
    { value: "crypto", label: "Crypto" },
    { value: "forensics", label: "Forensics" },
    { value: "reverse", label: "Reverse" },
    { value: "misc", label: "Misc" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login First to View Challenges", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "auth error",
      });
      setError("Authentication Error");
      setLoading(false);
      router.replace("/Auth/login");

      return;
    }
    if (!user) {
      toast.error("Login First to View Challenges", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
        toastId: "auth error",
      });
      setError("Authentication Error");
      setLoading(false);
      router.replace("/Auth/login");
      return;
    }
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/challenges", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch challenges");
        }

        setChallenges(data.challenges);
        setFilteredChallenges(data.challenges);

        if (data.solved && Array.isArray(data.solved)) {
          setSolvedChallenges(new Set(data.solved));
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredChallenges(challenges);
    } else {
      setFilteredChallenges(
        challenges.filter(
          (challenge) =>
            challenge.category.toLowerCase() === selectedCategory.toLowerCase(),
        ),
      );
    }
  }, [selectedCategory, challenges]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleFlagInputChange = (challengeId, value) => {
    setFlagInputs((prev) => ({
      ...prev,
      [challengeId]: value,
    }));
  };

  const submitFlag = async (challengeId) => {
    const flag = flagInputs[challengeId]?.trim();
    if (!flag) return;

    setSubmittingFlag(challengeId);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId,
          flag,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSolvedChallenges((prev) => new Set([...prev, challengeId]));
        setFlagInputs((prev) => ({
          ...prev,
          [challengeId]: "",
        }));
        toast.success(data.message, {
          theme: "dark",
          position: "bottom-right",
          autoClose: 3000,
        });
        setSelectedChallenge(null);
      } else {
        toast.error(data.message, {
          theme: "dark",
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("Error submitting flag. Please try again.", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setSubmittingFlag(null);
    }
  };

  const handleKeyPress = (e, challengeId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitFlag(challengeId);
    }
  };

  const openChallengeModal = (challenge) => {
    setSelectedChallenge(challenge);
  };

  const closeChallengeModal = () => {
    setSelectedChallenge(null);
  };

  if (role === "sudo") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 font-semibold text-lg mb-2">
            Bad Access
          </div>
          <div className="text-slate-400">
            Admin Should not Enter Competition...
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-white/10 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300 font-medium">
            Loading challenges...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 font-semibold text-lg mb-2">Error</div>
          <div className="text-slate-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {isAuthenticated && (
        <>
          <div className="">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                <h1 className="space-y-1 text-3xl font-bold text-white">
                  Challenges
                </h1>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-4xl text-sm font-medium ">
                    <Trophy className="w-4 h-4 " />
                    <span>{solvedChallenges.size} solved</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            filteredChallenges={filteredChallenges}
            challenges={challenges}
            onCategoryChange={handleCategoryChange}
          />

          <ChallengeGrid
            challenges={filteredChallenges}
            selectedCategory={selectedCategory}
            solvedChallenges={solvedChallenges}
            categories={categories}
            onChallengeClick={openChallengeModal}
          />

          <ChallengeModal
            challenge={selectedChallenge}
            isSolved={
              selectedChallenge
                ? solvedChallenges.has(selectedChallenge._id)
                : false
            }
            flagInput={
              selectedChallenge ? flagInputs[selectedChallenge._id] || "" : ""
            }
            onFlagChange={(value) =>
              handleFlagInputChange(selectedChallenge._id, value)
            }
            onKeyPress={handleKeyPress}
            onSubmit={submitFlag}
            onClose={closeChallengeModal}
            submittingFlag={submittingFlag}
          />
        </>
      )}
    </div>
  );
};

export default Challenges;
