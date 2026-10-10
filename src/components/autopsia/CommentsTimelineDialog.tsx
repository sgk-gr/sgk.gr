import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseAutopsia as supabase } from "@/lib/autopsia/supabase";
import { format, parseISO } from "date-fns";
import { el } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  History,
  MessageSquare,
  PenLine,
  Calendar,
  UserCircle,
  Save,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { logComment } from "@/lib/autopsia/comments";

export interface CommentsTimelineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: any | null;
  sourcePageName?: string;
  queryKeyToInvalidate?: string[];
  onCommentUpdated?: (newComment: string | null) => void;
}

export function CommentsTimelineDialog({
  open,
  onOpenChange,
  customer,
  sourcePageName = "Σημειώσεις Εργασίας",
  queryKeyToInvalidate = [],
  onCommentUpdated,
}: CommentsTimelineDialogProps) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>();
  const [localCustomerComments, setLocalCustomerComments] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [skipNextSync, setSkipNextSync] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserEmail(data.user?.email);
    });
  }, []);

  useEffect(() => {
    if (customer) {
      setNewComment("");
      setLocalCustomerComments(customer.thanasis_comments || null);
      setSkipNextSync(false);
    }
  }, [customer, open]);

  const {
    data: timelineComments,
    isLoading: isTimelineLoading,
    refetch: refetchTimeline,
  } = useQuery({
    queryKey: ["customer-timeline-comments", customer?.id],
    queryFn: async () => {
      if (!customer?.id) return [];
      const { data, error } = await supabase
        .from("customer_comments")
        .select("*")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: open && !!customer?.id,
  });

  useEffect(() => {
    if (timelineComments) {
      if (skipNextSync) {
        setSkipNextSync(false);
        return;
      }
      setItems(timelineComments);
    }
  }, [timelineComments]);

  const handleSaveComment = async () => {
    if (!customer?.id || !newComment.trim()) return;
    setIsSaving(true);
    const commentText = newComment.trim();
    
    // Instant optimistic add to top of timeline
    const optimisticEntry = {
      id: "temp-" + Date.now(),
      comment_text: commentText,
      user_email: currentUserEmail,
      created_at: new Date().toISOString(),
      source_page: sourcePageName,
    };
    setItems((prev) => [optimisticEntry, ...prev]);
    setNewComment("");
    setLocalCustomerComments(commentText);
    if (onCommentUpdated) onCommentUpdated(commentText);

    try {
      const { error: custErr } = await supabase
        .from("customers")
        .update({ thanasis_comments: commentText } as any)
        .eq("id", customer.id);
      if (custErr) throw custErr;

      await logComment(customer.id, currentUserEmail, commentText, sourcePageName);

      toast.success("Η νέα σημείωση προστέθηκε επιτυχώς!");
      refetchTimeline();
      if (queryKeyToInvalidate.length > 0) {
        queryKeyToInvalidate.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!window.confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την καταγραφή από το ιστορικό;")) return;
    
    console.log("[DELETE] Starting delete for entryId:", entryId, "type:", typeof entryId);
    console.log("[DELETE] Current items count:", items.length);
    
    // Immediate instant deletion in local state
    const remaining = items.filter((item) => item.id !== entryId);
    console.log("[DELETE] Remaining items after filter:", remaining.length);
    setItems(remaining);
    setSkipNextSync(true);

    const newLatest = remaining.length > 0 ? remaining[0].comment_text : null;
    setLocalCustomerComments(newLatest);
    if (onCommentUpdated) onCommentUpdated(newLatest);

    // Update query cache immediately so any re-render uses the filtered list
    queryClient.setQueryData(["customer-timeline-comments", customer?.id], remaining);

    try {
      console.log("[DELETE] Calling supabase delete on customer_comments, id =", entryId);
      const { error, data, status, statusText } = await supabase
        .from("customer_comments")
        .delete()
        .eq("id", entryId)
        .select();
      
      console.log("[DELETE] Supabase delete response - error:", error, "data:", data, "status:", status, "statusText:", statusText);
      
      if (error) throw error;

      if (!data || data.length === 0) {
        console.warn("[DELETE] WARNING: Delete returned 0 rows - entry may not have been deleted! entryId:", entryId);
      } else {
        console.log("[DELETE] Successfully deleted", data.length, "row(s) from customer_comments");
      }

      console.log("[DELETE] Updating customers.thanasis_comments to:", newLatest);
      const { error: custErr } = await supabase
        .from("customers")
        .update({ thanasis_comments: newLatest } as any)
        .eq("id", customer.id);
      
      if (custErr) {
        console.error("[DELETE] Error updating customers:", custErr);
      } else {
        console.log("[DELETE] customers.thanasis_comments updated OK");
      }

      toast.success("Η καταγραφή διαγράφηκε!");
      if (queryKeyToInvalidate.length > 0) {
        queryKeyToInvalidate.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    } catch (err: any) {
      console.error("[DELETE] CATCH ERROR:", err);
      toast.error("Σφάλμα κατά τη διαγραφή: " + err.message);
      setSkipNextSync(false);
      refetchTimeline();
    }
  };

  const handleClearCustomerComment = async () => {
    if (!customer?.id) return;
    if (!window.confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε τη σημείωση και όλο το ιστορικό του πελάτη;")) return;

    // Immediate instant clearance in local state
    setNewComment("");
    setLocalCustomerComments(null);
    setItems([]);
    setSkipNextSync(true);
    if (onCommentUpdated) onCommentUpdated(null);

    // Update query cache immediately
    queryClient.setQueryData(["customer-timeline-comments", customer?.id], []);

    try {
      const { error: custErr } = await supabase
        .from("customers")
        .update({ thanasis_comments: null } as any)
        .eq("id", customer.id);
      if (custErr) throw custErr;

      const { error: delErr } = await supabase
        .from("customer_comments")
        .delete()
        .eq("customer_id", customer.id);
      if (delErr) throw delErr;

      toast.success("Η σημείωση και το ιστορικό διαγράφηκαν!");
      if (queryKeyToInvalidate.length > 0) {
        queryKeyToInvalidate.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
      setSkipNextSync(false);
      refetchTimeline();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-slate-50 dark:bg-[#141413]">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 bg-white dark:bg-[#1f1f1e] border-b dark:border-[#2e2e2c] sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 rounded-xl shadow-sm">
                <History className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-[#f4f4f0] flex items-center gap-2">
                  Ιστορικό Σημειώσεων & Σχολίων (Timeline)
                </DialogTitle>
                <p className="text-xs text-slate-500 dark:text-[#9c9b95] font-medium mt-0.5">
                  {customer?.address || "Χωρίς διεύθυνση"}{" "}
                  {customer?.first_name ? `• ${customer.first_name} ${customer.last_name || ""}` : ""}{" "}
                  {customer?.sr ? `(SR: ${customer.sr})` : ""}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Add Note Box */}
          <div className="bg-white dark:bg-[#1f1f1e] p-3.5 rounded-xl border border-purple-200 dark:border-purple-500/30 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
              <PenLine className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Προσθήκη Νέας Σημείωσης στο Timeline</span>
            </div>
            <Textarea
              placeholder="Γράψτε νέα σημείωση για τον πελάτη..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[70px] text-sm bg-slate-50 dark:bg-[#181817] border-slate-300 dark:border-[#2e2e2c] text-slate-950 dark:text-[#f4f4f0] placeholder:text-slate-400 dark:placeholder:text-[#6b6b65] focus:bg-white dark:focus:bg-[#222220] resize-none font-medium"
            />
            <div className="flex items-center justify-between gap-2">
              {localCustomerComments ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 gap-1.5 text-xs font-bold"
                  onClick={handleClearCustomerComment}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Διαγραφή Σημείωσης
                </Button>
              ) : (
                <div />
              )}
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 text-xs font-bold shadow-sm"
                disabled={!newComment.trim() || isSaving}
                onClick={handleSaveComment}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Αποθήκευση...
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Προσθήκη Σημείωσης
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Timeline List */}
          {isTimelineLoading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-xs text-slate-500 dark:text-[#9c9b95] font-medium">Φόρτωση ιστορικού σημειώσεων...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200 dark:before:bg-purple-500/30">
              {items.map((entry: any, index: number) => {
                const formattedDate = entry.created_at
                  ? format(parseISO(entry.created_at), "dd MMMM yyyy, HH:mm", { locale: el })
                  : "Άγνωστη ημερομηνία";

                return (
                  <div key={entry.id || index} className="relative group">
                    {/* Timeline Pin/Dot */}
                    <div className="absolute -left-[27px] sm:-left-[35px] top-1.5 w-7 h-7 rounded-full bg-white dark:bg-[#1f1f1e] border-2 border-purple-500 shadow-sm flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <MessageSquare className="h-3.5 w-3.5" />
                    </div>

                    {/* Card */}
                    <div className="bg-white dark:bg-[#1f1f1e] rounded-xl border border-slate-200 dark:border-[#2e2e2c] shadow-sm p-4 hover:border-purple-300 dark:hover:border-purple-500/40 transition-colors space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-[#2e2e2c] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-[#f4f4f0] bg-slate-100 dark:bg-[#282826] px-2 py-0.5 rounded-md border border-transparent dark:border-[#383835]">
                            <UserCircle className="h-3.5 w-3.5 text-slate-600 dark:text-[#9c9b95]" />
                            {entry.user_email?.split("@")[0] || entry.user_email || "Χρήστης"}
                          </span>
                          {entry.source_page && (
                            <span className="text-[10px] font-semibold bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-500/30">
                              {entry.source_page}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-slate-400 dark:text-[#6b6b65] flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formattedDate}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-1 text-slate-400 dark:text-[#6b6b65] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                            title="Διαγραφή από το ιστορικό"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 dark:text-[#e3e3dc] leading-relaxed whitespace-pre-wrap font-medium">
                        {entry.comment_text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : localCustomerComments ? (
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200 dark:before:bg-purple-500/30">
              <div className="relative">
                <div className="absolute -left-[27px] sm:-left-[35px] top-1.5 w-7 h-7 rounded-full bg-white dark:bg-[#1f1f1e] border-2 border-amber-500 shadow-sm flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <MessageSquare className="h-3.5 w-3.5" />
                </div>
                <div className="bg-white dark:bg-[#1f1f1e] rounded-xl border border-amber-200 dark:border-amber-500/30 shadow-sm p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2e2e2c] pb-2">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-500/30">
                      Τρέχουσα Σημείωση (Αρχική)
                    </span>
                    <button
                      type="button"
                      onClick={handleClearCustomerComment}
                      className="p-1 text-slate-400 dark:text-[#6b6b65] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors text-xs font-semibold flex items-center gap-1"
                      title="Διαγραφή σημείωσης"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Διαγραφή
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-[#e3e3dc] leading-relaxed whitespace-pre-wrap font-medium">
                    {localCustomerComments}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-[#1f1f1e] rounded-xl border border-dashed border-slate-200 dark:border-[#2e2e2c]">
              <MessageSquare className="h-10 w-10 text-slate-300 dark:text-[#383835] mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-[#e3e3dc]">Δεν υπάρχουν καταγεγραμμένες σημειώσεις</p>
              <p className="text-xs text-slate-400 dark:text-[#6b6b65] mt-1">Γράψτε παραπάνω για να ξεκινήσετε το ιστορικό.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white dark:bg-[#1f1f1e] border-t dark:border-[#2e2e2c] flex justify-end">
          <Button variant="outline" size="sm" className="dark:bg-[#282826] dark:border-[#383835] dark:text-[#e3e3dc] dark:hover:bg-[#333330]" onClick={() => onOpenChange(false)}>
            Κλείσιμο
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

