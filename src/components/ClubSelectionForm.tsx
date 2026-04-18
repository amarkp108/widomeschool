import { useEffect, useState } from "react";
import { domains, type Domain, type Club } from "@/lib/clubData";
import { submitRegistrationToGoogleSheet } from "@/lib/googleSheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, BookOpen, CheckCircle2, School } from "lucide-react";
import schoolLogo from "@/assets/school-logo.jpeg";

const normalizeQueryParam = (value: string | null) => {
  if (!value) return "";

  const decoded = decodeURIComponent(value).trim();
  const placeholderMatch = decoded.match(/^\$\{(?:zf:)?(.+?)\}$/);
  if (placeholderMatch) {
    return placeholderMatch[1] || "";
  }

  return decoded;
};

export function ClubSelectionForm() {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedClubs, setSelectedClubs] = useState<Club[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [maxDialogOpen, setMaxDialogOpen] = useState(false);
  const [confirmationDialogState, setConfirmationDialogState] = useState<
    "confirm" | "minimum" | null
  >(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const maxSelections = 6;
  const totalSelected = selectedClubs.length;
  const isSubmitReady = totalSelected === maxSelections;
  const singleChoiceDomains = ["Dance", "Music", "Sports"];
  const basicprofdom = ["Dance"];
  const selectedDomainAllowsMultiple = selectedDomain
    ? !singleChoiceDomains.includes(selectedDomain.name)
    : true;

  const [studentDetails, setStudentDetails] = useState<{
    name: string;
    course: string;
    regNo: string;
    stream: string;
    section: string;
  }>({
    name: "",
    course: "",
    regNo: "",
    stream: "",
    section: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = normalizeQueryParam(params.get("name"));
    const course = normalizeQueryParam(params.get("course"));
    const regNo = normalizeQueryParam(params.get("regNo"));
    const stream = normalizeQueryParam(params.get("stream"));
    const section = normalizeQueryParam(params.get("section"));

    setStudentDetails({ name, course, regNo, stream, section });
  }, []);

  const isMaxReached = totalSelected >= maxSelections;

  const handleDomainSelect = (domain: Domain) => {
    if (selectedDomain?.id === domain.id) {
      setSelectedDomain(null);
      setPreviewOpen(false);
      return;
    }

    setSelectedDomain(domain);
    setPreviewOpen(false);
  };

  const handleSubmit = () => {
    if (!isSubmitReady) {
      setConfirmationDialogState("minimum");
      return;
    }

    setConfirmationDialogState("confirm");
  };

  const handleConfirmSubmit = async () => {
    setConfirmationDialogState(null);
    setSubmitError(null);
    setSubmitting(true);

    const selectedClubNames = selectedClubs.map((club) => club.name).join(", ");
    const selectedClubDomains = selectedClubs.map((club) => getDomainNameForClub(club)).join(", ");

    try {
      await submitRegistrationToGoogleSheet({
        name: studentDetails.name,
        course: studentDetails.course,
        regNo: studentDetails.regNo,
        stream: studentDetails.stream,
        section: studentDetails.section,
        clubs: selectedClubNames,
        clubDomains: selectedClubDomains,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
      setConfirmationDialogState("confirm");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedDomain(null);
    setSelectedClubs([]);
    setPreviewOpen(false);
    setMaxDialogOpen(false);
    setSubmitted(false);
  };

  const selectedCountForDomain = (domain: Domain) =>
    selectedClubs.filter((club) => domain.clubs.some((domainClub) => domainClub.name === club.name))
      .length;

  const getDomainNameForClub = (club: Club) =>
    domains.find((domain) => domain.clubs.some((domainClub) => domainClub.name === club.name))
      ?.name ?? "";

  const moveClub = (index: number, direction: -1 | 1) => {
    setSelectedClubs((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const selectedClubsPreview = selectedClubs.map((club, index) => {
    const domainName = getDomainNameForClub(club);
    const previousDomainName = index > 0 ? getDomainNameForClub(selectedClubs[index - 1]) : "";

    return {
      club,
      domainName,
      position: index + 1,
      showDomainName: index === 0 || domainName !== previousDomainName,
    };
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1b3a2d]">Registration Successful!</h2>
            <p className="mt-2 text-[#6b7280]">Your club preference has been recorded.</p>
            <div className="mt-6 rounded-xl bg-[#f8faf9] p-6 text-left text-sm max-w-md mx-auto">
              <div className="mb-4 flex items-center justify-between rounded-lg bg-[#eff1f3] px-4 py-3 text-sm font-semibold text-[#1b3a2d]">
                <span>Selected clubs</span>
                <span className="text-[#6b7280]">
                  {totalSelected}/{maxSelections}
                </span>
              </div>
              <div className="overflow-hidden rounded-xl border border-[#e5e7eb] text-sm">
                <div className="grid grid-cols-2 gap-4 bg-[#f3f4f6] px-4 py-3 text-xs uppercase tracking-[0.12em] text-[#6b7280]">
                  <span>Domain</span>
                  <span>Club</span>
                </div>
                <div className="divide-y divide-[#e5e7eb] bg-white">
                  {selectedClubsPreview.map((item, index) => (
                    <div
                      key={`${item.domainName}-${item.club.name}`}
                      className={cn(
                        "grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 px-4 py-3 text-sm text-[#1b3a2d]",
                        index === selectedClubsPreview.length - 1
                          ? "border-b-2 border-slate-500"
                          : "border-b border-slate-300",
                      )}
                    >
                      <span className={item.showDomainName ? "font-semibold" : "text-[#6b7280]"}>
                        {item.showDomainName ? item.domainName : ""}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e2e8f0] text-xs font-semibold text-[#1b3a2d]">
                          {item.position}
                        </span>
                        <span>{item.club.name}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-8 -mt-8 relative z-10 space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f2f5]">
              <BookOpen className="h-5 w-5 text-[#1b3a2d]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1b3a2d]">Student Details</h3>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-[#e5e7eb] text-sm">
            <div className="grid grid-cols-2 gap-4 bg-[#f3f4f6] px-4 py-3 text-xs uppercase tracking-[0.12em] text-[#6b7280]">
              <span>Name</span>
              <span>{studentDetails.name || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 px-4 py-3 text-sm text-[#1b3a2d]">
              <span className="font-semibold text-[#6b7280]">Course</span>
              <span>{studentDetails.course || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-[#f9fafb] px-4 py-3 text-sm text-[#1b3a2d]">
              <span className="font-semibold text-[#6b7280]">Reg No</span>
              <span>{studentDetails.regNo || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 px-4 py-3 text-sm text-[#1b3a2d]">
              <span className="font-semibold text-[#6b7280]">Stream</span>
              <span>{studentDetails.stream || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-[#f9fafb] px-4 py-3 text-sm text-[#1b3a2d]">
              <span className="font-semibold text-[#6b7280]">Section</span>
              <span>{studentDetails.section || "-"}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 rounded-full overflow-hidden bg-[#e5e7eb]">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#c8a951] to-[#e0c86e]"
            style={{
              width: selectedDomain
                ? `${Math.min((totalSelected / maxSelections) * 100, 100)}%`
                : "0%",
            }}
          />
        </div>

        {/* Domain Selection */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f2f5]">
              <BookOpen className="h-5 w-5 text-[#1b3a2d]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1b3a2d]">Choose Domain</h3>
              <p className="text-xs text-[#6b7280]">Select any six clubs in order of preference</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {domains.map((domain) => {
              const selectedCount = selectedCountForDomain(domain);

              return (
                <button
                  key={domain.id}
                  onClick={() => handleDomainSelect(domain)}
                  className={cn(
                    "rounded-xl border-2 px-4 py-3 text-left transition-all text-sm font-medium",
                    selectedDomain?.id === domain.id
                      ? "border-[#1b3a2d] bg-[#1b3a2d] text-white shadow-md"
                      : "border-[#e5e7eb] bg-white text-[#1b3a2d] hover:border-[#1b3a2d]/30 hover:bg-[#f8faf9]",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{domain.name}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                        selectedCount > 0
                          ? "bg-white text-[#1b3a2d]"
                          : "bg-[#e5e7eb] text-[#6b7280]",
                      )}
                    >
                      {selectedCount}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "block text-xs mt-1 font-normal",
                      selectedDomain?.id === domain.id ? "text-white/70" : "text-[#9ca3af]",
                    )}
                  >
                    {domain.clubs.length} clubs
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Club Selection */}
        {selectedDomain && (
          <>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f2f5]">
                  <School className="h-5 w-5 text-[#1b3a2d]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#1b3a2d]">Choose Club</h3>
                  <p className="text-xs text-[#6b7280]">
                    {singleChoiceDomains.includes(selectedDomain.name) ? (
                      selectedDomain.name === "Music" ? (
                        <>
                          Select any one choice{" "}
                          <span className="font-bold text-black">(Basic proficiency needed)</span>
                        </>
                      ) : (
                        "Select any one choice"
                      )
                    ) : (
                      <>
                        Select a club from{" "}
                        <Badge className="bg-[#1b3a2d]/10 text-[#1b3a2d] hover:bg-[#1b3a2d]/10 text-xs">
                          {selectedDomain.name}
                        </Badge>
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right text-xs text-[#6b7280]">
                  <div>Total selected</div>
                  <div className="font-semibold text-[#1b3a2d]">
                    {totalSelected}/{maxSelections}
                  </div>
                </div>
              </div>
              <div className="grid gap-3">
                {selectedDomain.clubs.map((club) => {
                  const isSelected = selectedClubs.some((selected) => selected.name === club.name);
                  const domainClubNames = selectedDomain.clubs.map((domainClub) => domainClub.name);
                  const hasSameDomainSelected = selectedClubs.some((selected) =>
                    domainClubNames.includes(selected.name),
                  );

                  return (
                    <button
                      key={club.name}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedClubs((prev) =>
                            prev.filter((selected) => selected.name !== club.name),
                          );
                          return;
                        }

                        if (!selectedDomainAllowsMultiple) {
                          if (isMaxReached && !hasSameDomainSelected) {
                            setMaxDialogOpen(true);
                            return;
                          }

                          setSelectedClubs((prev) => [
                            ...prev.filter((selected) => !domainClubNames.includes(selected.name)),
                            club,
                          ]);
                          return;
                        }

                        if (isMaxReached) {
                          setMaxDialogOpen(true);
                          return;
                        }

                        setSelectedClubs((prev) => [...prev, club]);
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all",
                        isSelected
                          ? "border-[#1b3a2d] bg-[#1b3a2d]/5 shadow-sm"
                          : "border-[#e5e7eb] hover:border-[#1b3a2d]/30 hover:bg-[#f8faf9]",
                      )}
                    >
                      <div>
                        <span className="font-semibold text-[#1b3a2d] text-sm">{club.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-[#1b3a2d] shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end pt-5 gap-3 flex-wrap">
                <Button
                  onClick={() => setPreviewOpen((prev) => !prev)}
                  className="px-4 h-11 rounded-xl bg-[#1b3a2d] hover:bg-[#153024] text-white"
                >
                  {previewOpen ? "Hide Preview" : "Show Preview"}
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="px-8 h-11 rounded-xl bg-[#1b3a2d] hover:bg-[#153024] text-white"
                >
                  Submit Registration
                </Button>
              </div>
              {previewOpen && (
                <div className="mt-5 overflow-hidden rounded-2xl bg-[#f8faf9] p-4 text-sm">
                  {selectedClubsPreview.length ? (
                    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white text-sm">
                      <div className="grid grid-cols-2 gap-4 bg-[#f3f4f6] px-4 py-3 text-xs uppercase tracking-[0.12em] text-[#6b7280]">
                        <span>Domain</span>
                        <span>Club</span>
                      </div>
                      <div className="divide-y divide-[#e5e7eb] bg-white">
                        {selectedClubsPreview.map((item, index) => (
                          <div
                            key={`${item.domainName}-${item.club.name}`}
                            className={cn(
                              "grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 px-4 py-3 text-sm text-[#1b3a2d]",
                              index === selectedClubsPreview.length - 1
                                ? "border-b-2 border-slate-500"
                                : "border-b border-slate-300",
                            )}
                          >
                            <span
                              className={item.showDomainName ? "font-semibold" : "text-[#6b7280]"}
                            >
                              {item.showDomainName ? item.domainName : ""}
                            </span>
                            <span className="flex flex-col gap-2">
                              <div className="flex items-center gap-3">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e2e8f0] text-xs font-semibold text-[#1b3a2d]">
                                  {item.position}
                                </span>
                                <span>{item.club.name}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => moveClub(index, -1)}
                                  disabled={index === 0}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:border-slate-400"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveClub(index, 1)}
                                  disabled={index === selectedClubsPreview.length - 1}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:border-slate-400"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </button>
                              </div>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#6b7280]">No clubs selected yet.</p>
                  )}
                </div>
              )}
            </div>

            <Dialog
              open={confirmationDialogState !== null}
              onOpenChange={(open) => !open && setConfirmationDialogState(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {confirmationDialogState === "confirm"
                      ? "Confirm Submission"
                      : "Selection Required"}
                  </DialogTitle>
                  <DialogDescription>
                    {confirmationDialogState === "confirm"
                      ? "No changes can be done once submitted. Are you sure you want to submit?"
                      : `You need to select ${maxSelections} clubs before submitting. Please add more clubs.`}
                  </DialogDescription>
                  {submitError ? (
                    <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                      {submitError}
                    </div>
                  ) : null}
                </DialogHeader>
                <DialogFooter>
                  {confirmationDialogState === "confirm" ? (
                    <>
                      <DialogClose asChild>
                        <Button className="px-6 h-11 rounded-xl bg-[#f3f4f6] text-[#1b3a2d] hover:bg-[#e5e7eb]">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handleConfirmSubmit}
                        disabled={submitting}
                        className="px-6 h-11 rounded-xl bg-[#1b3a2d] hover:bg-[#153024] text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? "Submitting..." : "Confirm"}
                      </Button>
                    </>
                  ) : (
                    <DialogClose asChild>
                      <Button className="px-6 h-11 rounded-xl bg-[#1b3a2d] hover:bg-[#153024] text-white">
                        OK
                      </Button>
                    </DialogClose>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={maxDialogOpen} onOpenChange={setMaxDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Maximum reached</DialogTitle>
                  <DialogDescription>
                    You have reached the maximum of 6 club selections. Remove one selection to add
                    another.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button className="px-6 h-11 rounded-xl bg-[#1b3a2d] hover:bg-[#153024] text-white">
                      OK
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="pb-14 pt-6 px-4" style={{ backgroundColor: "#1A5C2A" }}>
      <div className="mx-auto max-w-4xl flex flex-col items-center text-center gap-3">
        <img
          src={schoolLogo}
          alt="Wisdom World School Logo"
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-white">Clubs Wisdom Registration</h1>
          <p className="text-lg text-white">Wisdom World School - Kurukshetra</p>
        </div>
        <p className="text-xs text-white">Developed by Okie Dokie</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#6b7280]">{label}</span>
      <span className="font-medium text-[#1b3a2d]">{value}</span>
    </div>
  );
}
